import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CountryCode } from '../general/countries.dto';

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
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type?: WeddingSteps;
  placeInfo?: UpdatePlaceInfo;
  description?: string;
  location?: UpdateLocationInfo;
}

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type?: WeddingSteps;
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
  isPromoted;
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
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
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
