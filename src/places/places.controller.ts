import { Controller, Get, Query } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesViewModel } from '../types/places/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { dummyPlaces } from '../constants/dummy-places';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('getGooglePlaces')
  public getGooglePlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return this.placesService.getGooglePlaces(step);
  }
  // this is created to avoid overload google api with requests while testing
  @Get('getDummyPlaces')
  public async getDummyPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return await dummyPlaces(step);
  }
}
