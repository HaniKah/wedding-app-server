import { LatLng } from '../general/latlng.dto';

export class PlacesDto {
  placeId?: string;
  businessStatus?: string;
  location?: LatLng;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
}
export class PlacesViewModel {
  result: PlacesDto[];
}

export class GooglePlacesResponse {
  html_attributions: string[];
  results: google.maps.places.PlaceResult[];
  status: google.maps.places.PlacesServiceStatus;
}
export class PlaceDetailsDto {
  placeId?: string | undefined;
  name: string | undefined | null;
  nationalNumber: string | undefined | null;
  internationalNumber: string | undefined | null;
  formattedAddress: string | undefined | null;
  rating: number | undefined | null;
  userRatingCount: number | undefined | null;
  googleMapsUri: string | undefined | null;
}
