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
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    const transformer = new NumRangeValueTransformer();
    return transformer.transformNode(args.node, args.queryId);
  }

  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    const { result } = args;
    result.rows.forEach((row) => {
      if (this.isNumrange(row.priceRange)) {
        const list: string[] = (row.priceRange as string)
          .slice(1, -1)
          .split(',');
        row.priceRange = { min: list[0], max: list[1] };
      }
    });
    return args.result;
  }
  isNumrange(value: unknown): boolean {
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
    );
  }
  override transformValues(node: ValuesNode): ValuesNode {
    const transformed = node.values.map((row) => {
      const newValues = row.values.map((val) => {
        if (this.isNumRangeObj(val)) {
          // convert to PostgreSQL numrange format string
          return `[${val.min},${val.max}]`;
        }
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
