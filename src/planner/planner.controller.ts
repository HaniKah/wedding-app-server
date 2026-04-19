import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import {
  FavouritePlacesViewModel,
  PlaceDetailsDto,
  PlacesViewModel,
  ToggleFavoritePlaceFilterRequest,
  TogglePickedPlaceFilterRequest,
} from '../types/planner/places.dto';
import { ApiQuery } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';
import { CountryCode } from '../types/general/countries.dto';
import { Categories } from '../types/general/categories';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Get('getFavorites')
  public async getFavorites(
    @User() user: CurrentUser,
  ): Promise<FavouritePlacesViewModel> {
    return await this.plannerService.getFavorites(user.id);
  }

  @Get('getPlaces')
  @ApiQuery({ name: 'offset', required: true })
  @ApiQuery({ name: 'countryCode', required: true, enum: CountryCode })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false, enum: Categories })
  public async getPlaces(
    @Query('offset') offset: number,
    @Query('countryCode') countryCode: CountryCode,
    @Query('category') category: Categories,
    @Query('search') search?: string,
  ): Promise<PlacesViewModel> {
    return await this.plannerService.getPlaces(
      countryCode,
      offset,
      search,
      category,
    );
  }

  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
    @User() user: CurrentUser,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceDetailsById(user.id, placeId);
  }

  @Post('toggleFavoritePlaceFilter')
  public async toggleFavoritePlaceFilter(
    @Body() req: ToggleFavoritePlaceFilterRequest,
    @User() user: CurrentUser,
  ): Promise<void> {
    await this.plannerService.toggleFavorite(user.id, req);
  }

  @Post('togglePickedPlaceFilter')
  public async togglePickedPlaceFilter(
    @Body() req: TogglePickedPlaceFilterRequest,
    @User() user: CurrentUser,
  ) {
    await this.plannerService.togglePicked(user.id, req);
  }
}
