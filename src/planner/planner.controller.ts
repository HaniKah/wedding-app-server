import { Controller, Get, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  PlaceDetailsDto,
  PlacesViewModel,
  SearchFilter,
} from '../types/planner/places.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CountryCode } from '../types/general/countries.dto';
import { Public } from '../auth/decorators/public.decorator';
import { FavoritePlaceDto } from '../types/planner/favorites.dto';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Public()
  @Get('getPlaces')
  @ApiQuery({ name: 'offset', required: true })
  @ApiQuery({ name: 'countryCode', required: true, enum: CountryCode })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'filters', required: false })
  public async getPlaces(
    @Query('offset') offset: number,
    @Query('countryCode') countryCode: CountryCode,
    @Query('filters') filters?: SearchFilter,
    @Query('search') search?: string,
  ): Promise<PlacesViewModel> {
    return await this.plannerService.getPlaces(
      countryCode,
      offset,
      search,
      filters,
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
