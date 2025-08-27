import { Injectable } from '@nestjs/common';
import {
  GooglePlacesResponse,
  PlacesDto,
  PlacesViewModel,
  WeddingSteps,
} from './places.types';
import { GoogleApiService } from '../google-api/google-api.service';
import PlaceResult = google.maps.places.PlaceResult;

@Injectable()
export class PlacesService {
  constructor(private readonly googleApiService: GoogleApiService) {}
  public async getGooglePlaces(step: WeddingSteps): Promise<PlacesViewModel> {
    const resp: GooglePlacesResponse = await this.googleApiService.getPlaces(
      'nearby ' + step,
    );

    const places = resp.results.map((p: PlaceResult): PlacesDto => {
      return {
        placeId: p.place_id,
        businessStatus: p.business_status,
        location: p.geometry?.location,
        name: p.name,
        formatted_address: p.formatted_address,
        formatted_phone_number: p.formatted_phone_number,
      };
    });
    return {
      places: places,
    };
  }
}
