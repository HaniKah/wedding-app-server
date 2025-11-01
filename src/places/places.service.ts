import { Injectable } from '@nestjs/common';
import { CreatePlaceDto, CreatePlaceRequest } from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { MinioService } from '../minio/minio.service';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly minioService: MinioService,
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
}
