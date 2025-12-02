import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PhotosDto } from '../planner/photos.dto';

export enum PlaceStatus {
  Incomplete = 'Incomplete',
  Unpublished = 'Unpublished', // dont change this value , its default entry for db
  Published = 'Published',
}

export enum CreatePlaceSteps {
  PickPlaceType = 'PickPlaceType',
  FillPlaceInfo = 'FillPlaceInfo',
  AddDescription = 'AddDescription',
  AddSocialMedia = 'AddSocialMedia',
  PickPlaceLocation = 'PickPlaceLocation',
}

export class UpdatePlaceRequest {
  placeId?: number;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  weddingStep?: WeddingSteps;
  placeInfo?: VendorPlaceInfo;
  socialMedia?: VendorPlaceSocialMedia;
  description?: string;
  location?: UpdatePlaceLocation;
  @ApiProperty({ enum: CreatePlaceSteps, enumName: 'CreatePlaceSteps' })
  createStep: CreatePlaceSteps;
}

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  weddingStep?: WeddingSteps;
}

export class VendorPlaceDetailsViewModel {
  place: VendorPlaceDetailsDto;
  photos: VendorPlacePhoto[];
}

export class VendorPlaceDetailsDto {
  placeId: number;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  weddingStep: WeddingSteps;
  placeInfo?: VendorPlaceInfo;
  socialMedia: VendorPlaceSocialMedia;
  description?: string;
  location?: UpdatePlaceLocation;
}

export class VendorPlaceInfo {
  name: string;
  phoneNumber: string;
  priceRange: PlacePrice;
}

export class VendorPlaceSocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
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

export class VendorPlacePhoto {
  uri: string;
  main: boolean;
}

export class VendorPlaceListDto {
  id: number;
  name: string;
  streetName?: string;
  prices: PlacePrice;
  thumbnail: PhotosDto;
  @ApiProperty({ enum: PlaceStatus, enumName: 'PlaceStatus' })
  status: PlaceStatus;
}

export class VendorPlaceViewModel {
  result: VendorPlaceListDto[];
}
