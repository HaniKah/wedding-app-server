import { Injectable } from '@nestjs/common';
import {
  CreatePlaceDto,
  CreatePlaceRequest,
  PlacePrice,
  VendorPlaceDto,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { Money } from '../common/Money';

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
      priceRange: data.placeInfo.priceRange,
    });
    return {
      id: placeRecord.id,
    };
  }

  public async getPlaces(userId: number): Promise<VendorPlaceViewModel> {
    const places =
      await this.placesRepositoryService.getAllPlacesByUserId(userId);

    const viewModel: VendorPlaceDto[] = await Promise.all(
      places.map(async (p) => {
        const photo: string =
          await this.photosService.getMainPhotoOrFirstByPlaceId(
            p.id,
            PhotoSize.Small,
          );
        const price: PlacePrice = {
          priceRange: {
            min: new Money(p.priceRange.min).getFormatted,
            max: new Money(p.priceRange.max).getFormatted,
          },
          currency: p.currency,
        };
        return {
          id: p.id,
          name: p.name,
          streetName: p.streetName,
          prices: price,
          thumbnail: photo,
        };
      }),
    );
    return {
      result: viewModel,
    };
  }
}
