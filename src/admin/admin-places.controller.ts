import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PlacesService } from '../places/places.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../types/auth/auth.dto';
import {
  AdminCreatePlaceRequest,
  AdminPlaceDto,
  DeletePlaceRequest,
  PublishPlaceRequest,
  UpdatePlaceRequest,
  VendorPlaceDetailsDto,
} from '../types/places/places.dto';

@Roles(Role.Admin)
@Controller('admin/places')
export class AdminPlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get()
  async listPlaces(
    @Query('userId') userId?: string,
  ): Promise<AdminPlaceDto[]> {
    if (userId) {
      return await this.placesService.getAllPlacesByUserId(Number(userId));
    }
    return await this.placesService.getAllPlaces();
  }

  @Get(':id')
  async getPlace(@Param('id') id: string): Promise<VendorPlaceDetailsDto> {
    return await this.placesService.getPlaceDetails(Number(id));
  }

  @Post('create')
  async createPlace(
    @Body() body: AdminCreatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    return await this.placesService.createPlace(body.userId, {
      placeInfo: body.placeInfo,
    });
  }

  @Post('update')
  async updatePlace(
    @Body() body: UpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    return await this.placesService.editPlace(body);
  }

  @Post('delete')
  async deletePlace(@Body() body: DeletePlaceRequest) {
    return await this.placesService.deletePlace(body.id);
  }

  @Post('toggleStatus')
  async toggleStatus(@Body() body: PublishPlaceRequest): Promise<void> {
    await this.placesService.updateStatus(body.placeId, body.isPublished);
  }
}
