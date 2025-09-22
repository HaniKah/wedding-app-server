import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PlacesDto {
  id: number;
  name?: string | null;
  formattedAddress?: string | null;
}
export class PlaceDetailsDto {
  id: number;
  name: string;
  address: string | null;
  website: string | null;
  phoneNumber: string | null;
  minCost: number | null;
  maxCost: number | null;
  cost: number | null;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
  picked: boolean;
  favourite: boolean;
  notes: string | null;
}
export class PlacesViewModel {
  places: PlacesDto[];
}

//coming from google places api , a fetchName is used to fetch from the places photos api
export class PlacePhotoDto {
  photoRef: string;
  width: number | null;
  height: number | null;
  attributions: AuthorAttributionDto[] | null;
}
export class AuthorAttributionDto {
  displayName?: string | null;
  uri?: string | null;
  photoUri?: string | null;
}

export class PlaceDetailsRequest {
  placeId: number;
  cost: number | null;
  notes: string | null;
  favorite: boolean;
  picked: boolean;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
}
