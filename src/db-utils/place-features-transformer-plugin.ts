// import {
//   KyselyPlugin,
//   PluginTransformQueryArgs,
//   PluginTransformResultArgs,
//   QueryResult,
//   RootOperationNode,
//   UnknownRow,
// } from 'kysely';
// import { Categories } from '../types/general/categories';
// import { DressesFeatures, HostFeatures } from '../types/places/features.dto';
//
// export class FeaturesTransformerPlugin implements KyselyPlugin {
//   transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
//     return args.node; // no transformation needed
//   }
//
//   async transformResult(
//     args: PluginTransformResultArgs,
//   ): Promise<QueryResult<UnknownRow>> {
//     const rows = args.result.rows.map((row) => {
//       // only transform rows that have both category and data
//       if (!row.category || !row.data) return row;
//
//       return {
//         ...row,
//         data: this.mapFeatures(row.category as Categories, row.data),
//       };
//     });
//
//     return { ...args.result, rows };
//   }
//
//   private mapFeatures(category: Categories, data: unknown): unknown {
//     const raw = data as any;
//
//     switch (category) {
//       case Categories.Host: {
//         const features = new HostFeatures();
//         features.capacity = raw.capacity;
//         features.outdoor = raw.outdoor;
//         features.catering = raw.catering;
//         return features;
//       }
//
//       case Categories.Dress: {
//         const features = new DressesFeatures();
//         features.rent = raw.rent;
//         return features;
//       }
//
//       default:
//         return data;
//     }
//   }
// }
