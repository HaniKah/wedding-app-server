import { LatLng } from '../general/latlng.dto';

export class PlacesDto {
  placeId: string | null;
  location?: LatLng | null;
  name?: string | null;
  formattedAddress?: string | null;
  internationalPhoneNumber?: string | null;
}
export class PlacesViewModel {
  googlePlaces: PlacesDto[];
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

export class PlaceDetailsDto {
  placeId: string;
  name: string | null;
  nationalPhoneNumber: string | null;
  internationalPhoneNumber: string | null;
  website: string | null;
  formattedAddress: string | null;
  rating: number | null;
  photos: PlacePhotoDto[];
}
