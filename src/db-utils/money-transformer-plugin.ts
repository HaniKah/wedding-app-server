import {
  KyselyPlugin,
  PluginTransformQueryArgs,
  PluginTransformResultArgs,
  QueryResult,
  RootOperationNode,
  UnknownRow,
} from 'kysely';
import { Money } from '../common/Money';

export class MoneyTransformerPlugin implements KyselyPlugin {
  transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
    return args.node;
  }

  async transformResult(
    args: PluginTransformResultArgs,
  ): Promise<QueryResult<UnknownRow>> {
    const rows = args.result.rows.map((row) => {
      const transformedRow = { ...row };

      if (
        typeof row.minPrice === 'string' ||
        typeof row.minPrice === 'number'
      ) {
        transformedRow.minPrice = new Money(row.minPrice);
      } else if (row.minPrice === null) {
        transformedRow.minPrice = null;
      }

      if (
        typeof row.maxPrice === 'string' ||
        typeof row.maxPrice === 'number'
      ) {
        transformedRow.maxPrice = new Money(row.maxPrice);
      } else if (row.maxPrice === null) {
        transformedRow.maxPrice = null;
      }

      return transformedRow;
    });

    return { ...args.result, rows };
  }
}
