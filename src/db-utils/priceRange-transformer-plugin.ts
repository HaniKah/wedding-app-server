import {
  KyselyPlugin,
  OperationNodeTransformer,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
  ValuesNode,
} from 'kysely';
import { NumRangeDto } from '../types/general/numrange.dto';

export class PriceRangeTransformerPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    const transformer = new NumRangeValueTransformer();
    return transformer.transformNode(args.node, args.queryId);
  }

  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    const { result } = args;

    result.rows.forEach((row) => {
      if (row)
        if (this.isNumRangeString(row.priceRange)) {
          const list: string[] = (row.priceRange as string)
            .slice(1, -1)
            .split(',');
          row.priceRange = new NumRangeDto(list[0], list[1]);
        }
    });
    return args.result;
  }
  isNumRangeString(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const numRangeRegex = /^\[\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\]$/;
    return numRangeRegex.test(value);
  }
}

class NumRangeValueTransformer extends OperationNodeTransformer {
  isNumRangeObj(value: unknown): boolean {
    return (
      value &&
      typeof value === 'object' &&
      'min' in value &&
      typeof value.min === 'string' &&
      'max' in value &&
      typeof value.max === 'string'

      // value instanceof NumRangeDto
    );
  }
  override transformValues(node: ValuesNode): ValuesNode {
    const transformed = node.values.map((row) => {
      const newValues = row.values.map((val) => {
        if (this.isNumRangeObj(val)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return `[${val.min},${val.max}]`;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return val;
      });
      return {
        ...row,
        values: newValues,
      };
    });

    return {
      ...node,
      values: transformed,
    };
  }
}
