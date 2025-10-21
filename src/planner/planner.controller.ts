import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  PlaceDetailsDto,
  PlaceDetailsRequest,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { ChecklistViewModel, StepsViewModel } from '../types/planner/steps.dto';
import {
  UpdateDateRequest,
  WeddingDateDto,
} from '../types/planner/weddingDateDto';
import type { Request } from 'express';

@Controller('places')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getPlaces')
  public getPlaces(
    @Req() req: Request,
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
  public async getSteps(@Req() req: Request): Promise<StepsViewModel> {
    // const token = ExtractJwt.fromAuthHeaderAsBearerToken();
    // const tokenName = token.name;
    // const fromHeader = ExtractJwt.fromHeader('Authorization').name;
    return await this.plannerService.getSteps();
  }

  @Post('updatePlaceDetails')
  public async updatePlaceDetails(
    @Body() request: PlaceDetailsRequest,
  ): Promise<void> {
    await this.plannerService.updateAPlaceDetails(request);
  }

  @Get('getWeddingDate')
  public async getWeddingDate(): Promise<WeddingDateDto> {
    return await this.plannerService.getWeddingDate();
  }

  @Post('updateWeddingDate')
  public async updateWeddingDate(
    @Body() date: UpdateDateRequest,
  ): Promise<void> {
    return await this.plannerService.updateWeddingDate(new Date(date.date));
  }
  @Get('getChecklist')
  public async getChecklist(): Promise<ChecklistViewModel> {
    return await this.plannerService.createChecklist();
  }
}
