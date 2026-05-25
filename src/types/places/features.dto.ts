import { Categories } from '../general/categories';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeaturesRequest {
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  features: PlacesFeatures;
}
//todo: does using a class with static method here is a better practice ?
export class PlacesFeatures {
  rent?: boolean;
  capacity?: number;
  outdoor?: boolean;
}

export function normalizePlacesFeatures(
  category: Categories,
  features: PlacesFeatures,
): PlacesFeatures | null {
  if (!features) return null;
  switch (category) {
    case Categories.Host:
      return {
        capacity: 'capacity' in features ? features.capacity : undefined,
        outdoor: 'outdoor' in features ? features.outdoor : undefined,
      };
    case Categories.Dress:
      return {
        rent: 'rent' in features ? features.rent : undefined,
      };
  }
}
