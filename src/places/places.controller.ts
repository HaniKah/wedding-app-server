import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import {
  CreatePlaceDto,
  CreatePlaceRequest,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesService } from './places.service';
import type { Request } from 'express';
import { User } from '../decorators/user.decorator';
import { CurrentUser } from '../types/auth/auth.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

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
}
