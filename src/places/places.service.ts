import { Injectable } from '@nestjs/common';
import { WeddingSteps } from './places.types';
import { GoogleApiService } from '../google-api/google-api.service';

@Injectable()
export class PlacesService {
  constructor(private readonly googleApiService: GoogleApiService) {}
  public getPlaces(step: WeddingSteps) {
    return this.googleApiService.getPlaces('nearby' + step);
  }
}
