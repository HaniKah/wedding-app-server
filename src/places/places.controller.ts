import { Controller, Get } from '@nestjs/common';
import { PlacesService } from './places.service';
import { WeddingSteps } from './places.types';
import PlaceResult = google.maps.places.PlaceResult;

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('getDjs')
  public async getDjs(): Promise<PlaceResult> {
    return await this.placesService.getPlaces(WeddingSteps.Dj);
  }
}
