import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NumRangeDto } from '../general/numrange.dto';

export enum PlaceStatus {
  Incomplete = 'Incomplete',
  Unpublished = 'Unpublished', // dont change this value , its default entry for db
  Published = 'Published',
}

export enum CreatePlaceSteps {
  PickPlaceType = 'PickPlaceType',
  FillPlaceInfo = 'FillPlaceInfo',
  AddDescription = 'AddDescription',
  PickPlaceLocation = 'PickPlaceLocation',
}

export class CreateOrUpdatePlaceRequest {
  placeId?: number;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  weddingStep?: WeddingSteps;
  placeInfo?: UpdatePlaceInfo;
  description?: string;
  location?: UpdatePlaceLocation;
  @ApiProperty({ enum: CreatePlaceSteps, enumName: 'CreatePlaceSteps' })
  createStep: CreatePlaceSteps;
}

export class CreateOrUpdatePlaceDto {
  placeId: number;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  weddingStep: WeddingSteps;
  placeInfo?: UpdatePlaceInfo;
  description?: string;
  location?: UpdatePlaceLocation;
}

export class UpdatePlaceInfo {
  name: string;
  phoneNumber: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  priceRange: NumRangeDto;
}

export class UpdatePlaceLocation {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  googleId?: string;
}

export class PlacePrice {
  priceRange: PlacePriceRange;
  currency: string;
}

class PlacePriceRange {
  min: string;
  max: string;
}

export class PublishPlaceRequest {
  placeId: number;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
}

export class VendorPlaceDetailsDto {
  id: number;
  name: string;
  streetName?: string;
  phoneNumber: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
  placePrice: PlacePrice;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
  description?: string;
  mainPhoto: string;
}
export class VendorPlaceViewModel {
  result: VendorPlaceDto[];
}

export class VendorPlaceDto {
  id: number;
  name: string;
  streetName?: string;
  prices: PlacePrice;
  thumbnail: string;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
}
