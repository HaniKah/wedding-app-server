import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesViewModel, WeddingSteps } from './places.types';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('getPlace')
  public getPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return this.placesService.getGooglePlaces(step);
  }
}
