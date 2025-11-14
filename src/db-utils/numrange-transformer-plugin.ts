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

export class NumRangeTransformerPlugin implements KyselyPlugin {
  private readonly lookupFields = ['priceRange'];

  constructor(fields: string[]) {
    this.lookupFields.push(...fields);
  }

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
        //todo exaggerating with checks here, simplify it
        this.lookupFields.forEach((f) => {
          if (Object.prototype.hasOwnProperty.call(row, f))
            if (this.isNumRangeString(row[f])) {
              const list: string[] = (row.priceRange as string)
                .slice(1, -1)
                .split(',');
              row.priceRange = { min: list[0], max: list[1] };
            }
        });
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

      // value instanceof NumRange
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
