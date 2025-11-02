import { Injectable } from '@nestjs/common';
import {
  CreatePlaceDto,
  CreatePlaceRequest,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly photosService: PhotosService,
  ) {}
  public async createPlace(
    userId: number,
    data: CreatePlaceRequest,
  ): Promise<CreatePlaceDto> {
    const placeRecord = await this.placesRepositoryService.createPlace({
      userId: userId,
      step: data.type,
      name: data.placeInfo.name,
      phoneNumber: data.placeInfo.phoneNumber,
      streetName: data.location?.streetName,
      lng: data.location?.lng,
      lat: data.location?.lat,
      city: data.location?.city,
      googleId: data.location?.googleId,
      country: data.location?.country,
      postalCode: data.location?.postalCode,
      facebook: data.placeInfo.facebook,
      instagram: data.placeInfo.instagram,
      tiktok: data.placeInfo.tiktok,
      website: data.placeInfo.website,
    });
    return {
      id: placeRecord.id,
    };
  }

  public async getPlaces(userId: number): Promise<VendorPlaceViewModel> {
    const places =
      await this.placesRepositoryService.getAllPlacesByUserId(userId);

    const viewModel = await Promise.all(
      places.map(async (p) => {
        const photos = await this.photosService.getPhotosByPlaceId(p.id);
        return {
          id: p.id,
          phoneNumber: p.phoneNumber,
          streetName: p.streetName,
          facebook: p.facebook,
          instagram: p.instagram,
          website: p.website,
          name: p.name,
          tiktok: p.tiktok,
          photos: photos,
        };
      }),
    );
    return {
      result: viewModel,
    };
  }
}
