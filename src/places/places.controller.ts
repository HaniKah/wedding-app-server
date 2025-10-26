import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post('Create')
  public async createPlace(@Body() req: CreatePlaceRequest): Promise<void> {
    await this.placesService.createPlace(req);
  }
}
