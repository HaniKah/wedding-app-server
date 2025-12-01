import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  PublishPlaceRequest,
  UpdatePlaceRequest,
  VendorPlaceDetailsViewModel,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesService } from './places.service';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  // @Post('createPlace')
  // public async createPlace(
  //   @User() user: CurrentUser,
  //   @Body() body: CreatePlaceRequest,
  // ): Promise<VendorPlaceDetailsViewModel> {
  //   return await this.placesService.createPlace(user.id, body);
  // }

  @Post('updatePlace')
  public async updatePlace(
    @User() user: CurrentUser,
    @Body() body: UpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsViewModel> {
    if (body.placeId) {
      return await this.placesService.updatePlace(body);
    } else {
      return await this.placesService.createPlace(user.id, body);
    }
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
  ): Promise<VendorPlaceDetailsViewModel | null> {
    if (!id) return null;
    return await this.placesService.getPlaceDetails(id);
  }
}
