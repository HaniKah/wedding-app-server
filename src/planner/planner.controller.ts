import { Controller, Get, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { dummyPlaces } from '../constants/dummy-places';
import { dummySteps } from '../constants/dummy-steps';
import { StepsDto } from '../types/planner/steps.dto';

@Controller('places')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getGooglePlaces')
  public getGooglePlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return this.plannerService.getGooglePlaces(step);
  }

  @Get('getGooglePlaceById')
  public async getGooglePlaceById(
    @Query('placeId') placeId: string,
  ): Promise<PlaceDetailsDto> {
    const result = await this.plannerService.getGooglePlaceDetails(placeId);
    return result;
  }

  // this is created to avoid overload google api with requests while testing
  @Get('getPlaces')
  public async getPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return await dummyPlaces(step);
  }

  @Get('getSteps')
  public async getSteps(): Promise<StepsDto> {
    return dummySteps();
  }
}
