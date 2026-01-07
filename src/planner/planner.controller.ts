import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  PlaceDetailsDto,
  PlaceDetailsRequest,
  PlacesViewModel,
  SearchFilter,
} from '../types/planner/places.dto';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { ChecklistViewModel, StepsViewModel } from '../types/planner/steps.dto';
import {
  UpdateDateRequest,
  WeddingDateDto,
} from '../types/planner/weddingDateDto';
import type { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getPlaces')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'step', required: true, enum: WeddingSteps })
  @ApiQuery({ name: 'filter', required: false, enum: SearchFilter })
  @ApiQuery({ name: 'offset', required: true })
  public async getPlaces(
    @User() user: CurrentUser,
    @Query('step') step: WeddingSteps,
    @Query('offset') offset: number,
    @Query('search') search?: string,
    @Query('filter') filter?: SearchFilter,
  ): Promise<PlacesViewModel> {
    const places = await this.plannerService.getPlaces(
      user.id,
      step,
      search,
      filter,
      offset,
    );
    console.log(places);
    return places;
  }

  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceById(placeId);
  }
  @Get('getSteps')
  public async getSteps(@Req() req: Request): Promise<StepsViewModel> {
    const userId = req.user.id;
    return await this.plannerService.getSteps(userId);
  }

  @Post('updatePlaceDetails')
  public async updatePlaceDetails(
    @Body() request: PlaceDetailsRequest,
    @Req() req: Request,
  ): Promise<void> {
    await this.plannerService.updateAPlaceDetails(req.user.id, request);
  }

  @Get('getWeddingDate')
  public async getWeddingDate(@Req() req: Request): Promise<WeddingDateDto> {
    return await this.plannerService.getWeddingDate(req.user.id);
  }

  @Post('updateWeddingDate')
  public async updateWeddingDate(
    @Req() req: Request,
    @Body() date: UpdateDateRequest,
  ): Promise<void> {
    return await this.plannerService.updateWeddingDate(
      req.user.id,
      new Date(date.date),
    );
  }
  @Get('getChecklist')
  public async getChecklist(@Req() req: Request): Promise<ChecklistViewModel> {
    return await this.plannerService.createChecklist(req.user.id);
  }
}
