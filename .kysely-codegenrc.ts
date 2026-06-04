import { Config } from 'kysely-codegen';

export default {
  overrides: {
    columns: {
      'users.role': 'Role',

      'place_filter.step': 'Categories',
      'places.step': 'Categories',
      'places.status': 'PlaceStatus',
      'places.price_type': 'PriceType',
      'places.country': 'CountryCode',
      'places.sale_label': 'SaleLabel',

      'guests.couple_side': 'CoupleSide',
      'photos.size': 'PhotoSize',
      'photos.bucket_name': 'BucketName',
      'photosVariants.variant': 'PhotoSize',

      'checklist.timeframe': 'Timeframe',
      'places.features': 'PlacesFeatures',
      'places.min_price': 'Money',
      'places.max_price': 'Money',
    },
  },
  customImports: {
    CategoryFeatures: '../places/features.dto#PlacesFeatures',
  },

  defaultSchemas: ['planner'],
  camelCase: true,
  dialect: 'postgres',
} satisfies Config;
