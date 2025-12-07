import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import {
  CreatePlaceDto,
  CreatePlaceRequest,
  DeletePlaceRequest,
  PublishPlaceRequest,
  VendorPlaceDetailsDto,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesService } from './places.service';
import type { Request } from 'express';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('delete')
  public async deletePlace(@Body() body: DeletePlaceRequest) {
    return await this.placesService.deletePlace(body.id);
  }

  @Post('create')
  public async createPlace(
    @Req() req: Request,
    @Body() body: CreatePlaceRequest,
  ): Promise<CreatePlaceDto> {
    return await this.placesService.createPlace(req.user.id, body);
  }

  @Get('getPlaces')
  public async getPlaces(
    @User() user: CurrentUser,
  ): Promise<VendorPlaceViewModel> {
    return await this.placesService.getPlaces(user.id);
  }
  @Post('toggleStatus')
  public async toggleStatus(@Body() body: PublishPlaceRequest): Promise<void> {
    await this.placesService.updateStatus(body.placeId, body.status);
  }

  @Get('getPlaceDetails')
  public async getPlaceDetails(
    @Query('id') id: number,
  ): Promise<VendorPlaceDetailsDto> {
    return await this.placesService.getPlaceDetails(id);
  }
}
