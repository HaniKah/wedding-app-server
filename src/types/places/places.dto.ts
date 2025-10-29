import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type: WeddingSteps;
  placeInfo: CreatePlaceInfo;
  location: CreatePlaceLocation | undefined;
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  files: any[];
}
class CreatePlaceInfo {
  name: string;
  phoneNumber: string;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
}

class CreatePlaceLocation {
  streetName: string;
  city: string;
  country: string;
  postalCode: string;
  lat: number | null;
  lng: number | null;
  googleId: string | null;
}
