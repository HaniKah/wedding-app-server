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
