import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NumRange } from '../general/NumRange';

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
  prices: PlacePrice;
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
  priceRange: NumRange;
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

export class PlacePrice {
  price: string | undefined;
  priceRange: PriceRange | undefined;
  currency: string;
}
export class PriceRange {
  min: string;
  max: string;
}
