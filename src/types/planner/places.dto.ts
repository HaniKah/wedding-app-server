export class PlacesDto {
  placeId: number;
  name?: string | null;
  formattedAddress?: string | null;
}
export class PlaceDetailsDto {
  id: number;
  name: string;
  address: string | null;
  website: string | null;
  phoneNumber: string | null;
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

// export class PlaceDetailsDto {
//   placeId: string;
//   name: string | null;
//   nationalPhoneNumber: string | null;
//   internationalPhoneNumber: string | null;
//   website: string | null;
//   formattedAddress: string | null;
//   rating: number | null;
//   photos: PlacePhotoDto[];
// }
