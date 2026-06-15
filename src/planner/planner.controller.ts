import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  GetPlacesRequest,
  PlaceDetailsDto,
  PlacesViewModel,
} from '../types/planner/places.dto';
import { Public } from '../auth/decorators/public.decorator';
import { FavoritePlaceDto } from '../types/planner/favorites.dto';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Public()
  @Post('getPlaces')
  public async getPlaces(
    @Body() request: GetPlacesRequest,
  ): Promise<PlacesViewModel> {
    return await this.plannerService.getPlaces(
      request.countryCode,
      request.offset,
      request.search,
      request.filters,
    );
  }
  @Public()
  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceDetailsById(placeId);
  }
  @Get('getFavorites')
  public async getFavorites(
    @Query('id') id: number,
  ): Promise<FavoritePlaceDto> {
    return await this.plannerService.getFavorites(Number(id));
  }
}
