import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreatePlaceDto, CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesService } from './places.service';
import type { Request } from 'express';

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
}
