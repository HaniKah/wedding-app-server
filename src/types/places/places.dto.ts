import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '../general/countries.dto';
import { Categories } from '../general/categories';

export enum UpdateStep {
  PickPlaceType = 'PickPlaceType',
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
  id?: number;
  @ApiProperty({ enum: UpdateStep, enumName: 'UpdateStep' })
  updateStep?: UpdateStep;
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  type?: Categories;
  placeInfo?: UpdatePlaceInfo;
  description?: string;
  location?: UpdateLocationInfo;
}

export class CreatePlaceRequest {
  @ApiProperty({ enum: Categories, enumName: 'Categories' })
  type?: Categories;
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
  currency: string;
  thumbnail: string;
  isPublished: boolean;
  isCompleted: boolean;
  isPromoted: boolean;
  minPrice: string;
  maxPrice: string;
}

class UpdatePlaceInfo {
  name?: string;
  phoneNumber?: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  minPrice?: string;
  maxPrice?: string;
  priceType?: PriceType;
}

class UpdateLocationInfo {
  streetName?: string;
  city?: string;
  countryCode?: CountryCode;
  postalCode?: string;
  lat?: number;
  lng?: number;
  googleId?: string;
}

export class PublishPlaceRequest {
  placeId: number;
  isPublished: boolean;
}

export class VendorPlaceDetailsDto {
  id: number;
  name: string;
  @ApiProperty({ enum: Categories, enumName: 'WeddingSteps' })
  step: Categories;
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
  googleId?: string;
  @ApiProperty({ enum: CountryCode, enumName: 'CountryCode' })
  countryCode: CountryCode;
  currency: string;
  countryName: string;
}
