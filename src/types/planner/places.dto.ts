import { ApiProperty } from '@nestjs/swagger';
import { PriceType } from '../places/places.dto';
import { Categories } from '../general/categories';
import { CountryCode } from '../general/countries.dto';
import { PlacesFeatures } from '../places/features.dto';

export class PlacesDto {
  id: number;
  name?: string | null;
  formattedAddress?: string | null;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  mainPhoto: string;
  mainPhotoBlurhash?: string;
  minPrice: string;
  maxPrice: string;
  isPromoted: boolean;
  label: string | null;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
  phoneNumber: string;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  country: CountryCode;
  city: string;
  features: PlacesFeatures;
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
  // photosCount: number;
  // mainPhoto: string;
  // mainPhotoBlurhash?: string;
  photos: PlaceDetailsPhotos[];
  maxPrice: string | undefined;
  minPrice: string | undefined;
  description: string;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  countryCode: CountryCode;
  city: string;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
  features: PlacesFeatures;
}

export class PlaceDetailsPhotos {
  url: string;
  blurhash: string;
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

export class FavouritePlacesViewModel {
  result: PlacesDto[];
}
