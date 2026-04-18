import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '../general/countries.dto';
import { Categories } from '../general/categories';

export enum UpdateStep {
  FillPlaceInfo = 'FillPlaceInfo',
  AddDescription = 'AddDescription',
  PickPlaceLocation = 'PickPlaceLocation',
  UploadImages = 'UploadImages',
}

// export enum PlaceStatus {
//   Unpublished = 'Unpublished', // dont change this value , its default entry for db
//   Published = 'Published',
// }

export enum PriceType {
  None = 'None',
  PerPerson = 'PerPerson',
  PerHour = 'PerHour',
  PerItem = 'PerItem',
  PerEvent = 'PerEvent',
}

export class DeletePlaceRequest {
  id: number;
}

export class UpdatePlaceRequest {
  id: number;
  @ApiProperty({ enum: UpdateStep, enumName: 'UpdateStep' })
  updateStep: UpdateStep;
  placeInfo?: PlaceInfo;
  description?: string;
  location?: LocationInfo;
  socialMedia?: SocialMediaInfo;
}

export class CreatePlaceRequest {
  placeInfo: PlaceInfo;
  location: LocationInfo;
}

export class VendorPlaceViewModel {
  published: {
    title: string;
    data: VendorPlaceDto[];
  };
  unpublished: {
    title: string;
    data: VendorPlaceDto[];
  };
  uncompleted: {
    title: string;
    data: VendorPlaceDto[];
  };
}

export class VendorPlaceDto {
  id: number;
  name: string;
  streetName?: string;
  thumbnail: string;
  isPublished: boolean;
  isCompleted: boolean;
  isPromoted: boolean;
  minPrice: string;
  maxPrice: string;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  country: CountryCode;
  city: string;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
}

class PlaceInfo {
  name: string;
  phoneNumber: string;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  minPrice?: string;
  maxPrice?: string;
  priceType: PriceType;
}

class LocationInfo {
  city: string;
  countryCode: CountryCode;
  streetName?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  googleId?: string;
}
class SocialMediaInfo {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  website?: string;
}

export class PublishPlaceRequest {
  placeId: number;
  isPublished: boolean;
}

export class VendorPlaceDetailsDto {
  id: number;
  name: string;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  category: Categories;
  streetName?: string;
  phoneNumber: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  isPublished: boolean;
  description?: string;
  mainPhoto: string;
  minPrice: string;
  maxPrice: string;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  countryCode: CountryCode;
  city: string;
}
