import { LatLng } from '../general/latlng.dto';

export class PlacesDto {
  placeId: string | null;
  businessStatus?: string | null;
  location?: LatLng | null;
  name?: string | null;
  formatted_address?: string | null;
  formatted_phone_number?: string | null;
}
export class PlacesViewModel {
  result: PlacesDto[];
}

//coming from google places api , a fetchName is used to fetch from the places photos api
export class PlacePhotoDto {
  photoRef: string;
  width: number;
  height: number;
  attributions: string[];
}

export class PlaceDetailsDto {
  placeId: string;
  name: string | null;
  internationalNumber: string | null;
  formattedPhoneNumber: string | null;
  website: string | null;
  formattedAddress: string | null;
  rating: number | null;
  userRatingCount: number | null;
  photos: PlacePhotoDto[];
}
