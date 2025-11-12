import {
  KyselyPlugin,
  OperationNodeTransformer,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
  ValueNode,
} from 'kysely';
import { NumRange } from '../types/general/NumRange';

/**
 * Transformer plugin that converts { min, max } <-> PostgreSQL numrange strings safely.
 */
export class NumRangeTransformerPlugin implements KyselyPlugin {
  // Check if string is a PostgreSQL numrange literal
  static isNumRangeString(value: string): boolean {
    return /^[[(][\d.]*,[\d.]*[\])]$|^empty$/.test(value);
  }

  // ======= Static helpers =======

  // Parse PostgreSQL numrange string into { min, max }
  static parseNumRange(value: string): NumRange {
    if (value === 'empty') return { min: null, max: null };
    const match = value.match(/^[[(]([\d.]*),([\d.]*)[\])]$/);
    return {
      min: match?.[1] || null,
      max: match?.[2] || null,
    };
  }

  // Transform a single row from the DB
  static transformRow(row: any): any {
    if (!row || typeof row !== 'object') return row;
    const transformed: any = {};

    for (const key in row) {
      if (Object.prototype.hasOwnProperty.call(row, key)) {
        const value = row[key];
        if (typeof value === 'string' && this.isNumRangeString(value)) {
          transformed[key] = this.parseNumRange(value);
        } else {
          transformed[key] = value;
        }
      }
    }

    return transformed;
  }

  // Transform query AST before execution
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    const transformer = new NumRangeValueTransformer();
    const result = transformer.transformNode(args.node);
    return result;
  }

  // Transform result rows after execution
  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    const result = args.result;
    const rows = (result.rows as any[]) ?? [];

    const transformedRows = rows.map((row) =>
      NumRangeTransformerPlugin.transformRow(row),
    );

    return { ...result, rows: transformedRows };
  }
}

/**
 * Transformer for Kysely AST nodes.
 * Replaces any ValueNode containing { min, max } objects with PostgreSQL range strings.
 */
class NumRangeValueTransformer extends OperationNodeTransformer {
  // Convert { min, max } to SQL range literal
  numRangeToString(range: NumRange): string {
    if (!range.min && !range.max) return 'empty::numrange';
    const min = range.min ?? '';
    const max = range.max ?? '';
    const result = `[${min},${max})::numrange`; // explicit cast to numrange
    return result;
  }

  transformValue(node: ValueNode): ValueNode {
    const value: unknown = node.value;
    if (
      value &&
      typeof value === 'object' &&
      'min' in value &&
      'max' in value &&
      typeof value.min === 'string' &&
      typeof value.max === 'string'
    ) {
      return {
        ...node,
        value: this.numRangeToString(value as NumRange),
      };
    }
    return node;
  }
}
