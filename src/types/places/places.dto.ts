import { LatLng } from '../general/latlng.dto';

export class PlaceViewModel {
  placeId: string | undefined;
  businessStatus: string | undefined;
  location: LatLng | undefined;
  name: string | undefined;

  formatted_address: string | undefined;

  formatted_phone_number: string | undefined;
}
export class PlacesViewModel {
  result: PlaceViewModel[];
}

export class GooglePlacesResponse {
  html_attributions: string[];
  results: google.maps.places.PlaceResult[];
  status: google.maps.places.PlacesServiceStatus;
}
