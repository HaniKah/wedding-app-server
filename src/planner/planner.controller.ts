import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  PlaceDetailsDto,
  PlaceFilterRequest,
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
import { CountryCode } from '../types/general/countries.dto';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getPlaces')
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'step', required: true, enum: WeddingSteps })
  @ApiQuery({ name: 'filter', required: false, enum: SearchFilter })
  @ApiQuery({ name: 'offset', required: true })
  @ApiQuery({ name: 'countryCode', required: true, enum: CountryCode })
  public async getPlaces(
    @User() user: CurrentUser,
    @Query('step') step: WeddingSteps,
    @Query('offset') offset: number,
    @Query('countryCode') countryCode: CountryCode,
    @Query('search') search?: string,
    @Query('filter') filter?: SearchFilter,
  ): Promise<PlacesViewModel> {
    return await this.plannerService.getPlaces(
      user.id,
      step,
      countryCode,
      offset,
      search,
      filter,
    );
  }

  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
    @User() user: CurrentUser,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceDetailsById(user.id, placeId);
  }
  @Get('getSteps')
  public async getSteps(@Req() req: Request): Promise<StepsViewModel> {
    const userId = req.user.id;
    return await this.plannerService.getSteps(userId);
  }

  @Post('updateOrCreatePlaceFilter')
  public async updateOrCreatePlaceFilter(
    @Body() req: PlaceFilterRequest,
    @User() user: CurrentUser,
  ): Promise<void> {
    await this.plannerService.updateOrCreatePlaceFilter(user.id, req);
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
