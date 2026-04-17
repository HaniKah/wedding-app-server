import { ApiProperty } from '@nestjs/swagger';
import { PriceType } from '../places/places.dto';
import { Categories } from '../general/categories';

export class PlacesDto {
  id: number;
  name?: string | null;
  formattedAddress?: string | null;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  mainPhoto: string;
  minPrice: string;
  maxPrice: string;
  isPromoted: boolean;
  label: string | null;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
  phoneNumber: string;
}

export class PlaceDetailsDto {
  id: number;
  name: string;
  address?: string;
  website?: string;
  facebook?: string;
  tiktok?: string;
  instagram?: string;
  phoneNumber: string;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  picked: boolean;
  favourite: boolean;
  mainPhoto: string;
  maxPrice: string;
  minPrice: string;
  description: string;
}

export class PlacesViewModel {
  places: PlacesDto[];
}

export class SearchFilter {
  category?: Categories;
}

//coming from google places api , a fetchName is used to fetch from the places photos api
export class PlacePhotoDto {
  photoRef: string;
  width: number | null;
  height: number | null;
  attributions: AuthorAttributionDto[] | null;
}

export class AuthorAttributionDto {
  displayName?: string | null;
  uri?: string | null;
  photoUri?: string | null;
}

export class PlaceFilterRequest {
  placeId: number;
  notes?: string | null;
  favorite?: boolean;
  picked?: boolean;
}

export class ToggleFavoritePlaceFilterRequest {
  placeId: number;
  favorite: boolean;
}

export class TogglePickedPlaceFilterRequest {
  placeId: number;
  picked: boolean;
  @ApiProperty({ enum: Categories, enumName: 'WeddingSteps' })
  step: Categories;
}

export class FavouritePlacesDto {
  id: number;
  name: string;
  city: string;
}

export class FavouritePlacesViewModel {
  result: FavouritePlacesDto[];
}
