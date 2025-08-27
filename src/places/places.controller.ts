import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { WeddingSteps } from './places.types';
import PlaceResult = google.maps.places.PlaceResult;

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('getPlace')
  public getPlaces(@Query('step') step: WeddingSteps): Promise<PlaceResult[]> {
    return this.placesService.getGooglePlaces(step);
  }
}
