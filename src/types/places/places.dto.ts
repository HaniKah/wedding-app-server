import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

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

export enum CountryCode {
  BAHRAIN = 'BHR',
  CYPRUS = 'CYP',
  EGYPT = 'EGY',
  IRAN = 'IRN',
  IRAQ = 'IRQ',
  JORDAN = 'JOR',
  KUWAIT = 'KWT',
  LEBANON = 'LBN',
  OMAN = 'OMN',
  PALESTINE = 'PSE',
  QATAR = 'QAT',
  SAUDI_ARABIA = 'SAU',
  SYRIA = 'SYR',
  TURKEY = 'TUR',
  UNITED_ARAB_EMIRATES = 'ARE',
  YEMEN = 'YEM',
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
  country?: CountryCode;
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
  currency: string;
  isPublished: boolean;
  description?: string;
  mainPhoto: string;
  minPrice: string;
  maxPrice: string;
  @ApiProperty({ enum: PriceType, enumName: 'PriceType' })
  priceType: PriceType;
  googleId?: string;
  @ApiProperty({
    enum: CountryCode,
    enumName: 'CountryCode',
    'x-enumNames': [
      'BAHRAIN',
      'CYPRUS',
      'EGYPT',
      'IRAN',
      'IRAQ',
      'JORDAN',
      'KUWAIT',
      'LEBANON',
      'OMAN',
      'PALESTINE',
      'QATAR',
      'SAUDI_ARABIA',
      'SYRIA',
      'TURKEY',
      'UNITED_ARAB_EMIRATES',
      'YEMEN',
    ],
  })
  country: CountryCode;
}
