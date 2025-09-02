import LatLng = google.maps.LatLng;

export enum WeddingSteps {
  Date = 'Date',
  Host = 'Host',
  Dress = 'Dress',
  Photographer = 'Photographer',
  Dj = 'Dj',
  MakeUpArtist = 'MakeUpArtist',
  Decorator = 'Decorator',
  Catering = 'Catering',
  Coordinator = 'Coordinator',
  DancingCourse = 'DancingCourse',
  Aarada = 'Aarada',
  Car = 'Car',
  HotelAfterWedding = 'HotelAfterWedding',
  Giveaways = 'Giveaways',
  MusiciansAndPerformers = 'MusiciansAndPerformers',
  Jewelry = 'Jewelry',
  Perfumes = 'Perfumes',
  Hammam = 'Hammam',
  CosmeticClinics = 'CosmeticClinics',
  ExtraDecorations = 'ExtraDecorations',
}

export interface GooglePlacesResponse {
  html_attributions: string[];
  results: google.maps.places.PlaceResult[];
  status: google.maps.places.PlacesServiceStatus;
}

export class PlacesDto {
  placeId?: string;
  businessStatus?: string;
  location?: LatLng;
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
}
export class PlacesViewModel {
  places: PlacesDto[];
}
