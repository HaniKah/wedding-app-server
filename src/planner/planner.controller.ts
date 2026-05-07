import { Controller, Get, Query } from '@nestjs/common';
import { PlannerService } from './planner.service';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CountryCode } from '../types/general/countries.dto';
import { Categories } from '../types/general/categories';
import { Public } from '../auth/decorators/public.decorator';

@Controller('planner')
export class PlannerController {
  constructor(private readonly plannerService: PlannerService) {}

  @Public()
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
  @Public()
  @Get('getPlaceById')
  public async getPlaceById(
    @Query('placeId') placeId: number,
  ): Promise<PlaceDetailsDto> {
    return await this.plannerService.getPlaceDetailsById(placeId);
  }
}
