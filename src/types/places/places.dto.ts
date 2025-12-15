import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum UpdateStep {
  PickPlaceType = 'PickPlaceType',
  FillPlaceInfo = 'FillPlaceInfo',
  AddDescription = 'AddDescription',
  PickPlaceLocation = 'PickPlaceLocation',
  UploadImages = 'UploadImages',
}

export enum PlaceStatus {
  Unpublished = 'Unpublished', // dont change this value , its default entry for db
  Published = 'Published',
}

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
  placeInfo?: PlaceInfo;
  description?: string;
  location?: PlaceLocation;
}

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type?: WeddingSteps;
  placeInfo?: PlaceInfo;
  description?: string;
  location?: PlaceLocation;
}

export class VendorPlaceViewModel {
  published: {
    title: PlaceStatus;
    data: VendorPlaceDto[];
  };
  unpublished: {
    title: PlaceStatus;
    data: VendorPlaceDto[];
  };
}

export class VendorPlaceDto {
  id: number;
  name: string;
  streetName?: string;
  currency: string;
  thumbnail: string;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
  minPrice: string;
  maxPrice: string;
}

class PlaceInfo {
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

class PlaceLocation {
  streetName?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
  googleId?: string;
}

export class PublishPlaceRequest {
  placeId: number;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
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
  currency: string;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
  description?: string;
  mainPhoto: string;
  minPrice: string;
  maxPrice: string;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
}
