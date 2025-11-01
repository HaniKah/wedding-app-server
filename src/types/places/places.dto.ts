import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceRequest {
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  type: WeddingSteps;
  placeInfo: CreatePlaceInfo;
  location?: CreatePlaceLocation;
}
// export class UploadFileRequest {
//   @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
//   files: any[];
// }

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
