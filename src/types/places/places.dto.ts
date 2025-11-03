import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type: WeddingSteps;
  placeInfo: CreatePlaceInfo;
  location?: CreatePlaceLocation;
}

export class VendorPlaceViewModel {
  result: VendorPlaceDto[];
}

export class VendorPlaceDto {
  id: number;
  name: string;
  streetName?: string;
  thumbnail: string;
}

export class CreatePlaceDto {
  id: number;
}
class CreatePlaceInfo {
  name: string;
  phoneNumber: string;
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}

class CreatePlaceLocation {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  googleId?: string;
}
