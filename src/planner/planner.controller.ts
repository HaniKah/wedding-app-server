import { Controller, Get, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { StepsViewModel } from '../types/planner/stepsViewModel';

@Controller('places')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getPlaces')
  public getPlaces(
    @Query('step') step: WeddingSteps,
  ): Promise<PlacesViewModel> {
    return this.plannerService.getPlaces(step);
  }

  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceById(placeId);
  }
  @Get('getSteps')
  public async getSteps(): Promise<StepsViewModel> {
    return await this.plannerService.getSteps();
  }
}
