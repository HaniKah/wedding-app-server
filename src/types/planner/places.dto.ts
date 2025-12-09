import { WeddingSteps } from '../general/wedding-steps-enum.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum SearchFilter {
  MyPick = 'MyPick',
  MyFavourite = 'MyFavourite',
  onSale = 'onSale',
}
export class PlacesDto {
  id: number;
  name?: string | null;
  formattedAddress?: string | null;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
  picked: boolean;
  favourite: boolean;
  @ApiProperty({ enum: SearchFilter, enumName: 'SearchFilter' })
  mainPhoto: string;
}

export class PlaceDetailsDto {
  id: number;
  name: string;
  address?: string;
  website?: string;
  facebook?: string;
  tiktok?: string;
  instagram?: string;
  phoneNumber: string;
  currency: string;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
  picked: boolean;
  favourite: boolean;
  notes: string | null;
  mainPhoto: string;
}
export class PlacesViewModel {
  places: PlacesDto[];
  filter?: SearchFilter;
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
  notes: string | null;
  favorite: boolean;
  picked: boolean;
  @ApiProperty({ enum: WeddingSteps, enumName: 'WeddingSteps' })
  step: WeddingSteps;
}
