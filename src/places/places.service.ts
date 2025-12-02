import { Injectable } from '@nestjs/common';
import {
  CreateOrUpdatePlaceRequest,
  CreatePlaceDto,
  CreatePlaceSteps,
  PlacePrice,
  PlaceStatus,
  UpdatePlaceInfo,
  UpdatePlaceLocation,
  VendorPlaceDetailsDto,
  VendorPlaceDto,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { Money } from '../common/Money';
import { Places } from 'kysely-codegen';
import { Selectable } from 'kysely';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly photosService: PhotosService,
  ) {}

  public async getPlaceDetails(
    placeId: number,
  ): Promise<VendorPlaceDetailsDto> {
    const p = await this.placesRepositoryService.getPlaceById(placeId);

    const mainPhoto: string =
      await this.photosService.getMainPhotoOrFirstByPlaceId(
        p.id,
        PhotoSize.Small,
      );

    const priceRange = {
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
      phoneNumber: p.phoneNumber,
      facebook: p.facebook,
      instagram: p.instagram,
      tiktok: p.tiktok,
      website: p.website,
      placePrice: priceRange,
      status: p.status,
      description: p.description,
      mainPhoto: mainPhoto,
    };
  }

  public async updateStatus(placeId: number, status: PlaceStatus) {
    await this.placesRepositoryService.updateStatusById(placeId, {
      status: status,
    });
  }

  public async createPlace(
    userId: number,
    data: CreateOrUpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    const createdPlaceRecord = await this.placesRepositoryService.createPlace({
      userId,
      step: data.weddingStep,
    });
    return this.getPlaceDetails(createdPlaceRecord.id);
  }

  public async updatePlace(
    data: CreateOrUpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    switch (data.createStep) {
      case CreatePlaceSteps.PickPlaceType:
        await this.updatePlaceType(data.placeId, data.weddingStep);
        break;
      case CreatePlaceSteps.FillPlaceInfo:
        await this.updatePlaceInfo(data.placeId, data.placeInfo);
        break;
      case CreatePlaceSteps.PickPlaceLocation:
        await this.updatePlaceLocation(data.placeId, data.location);
        break;
      case CreatePlaceSteps.AddDescription:
        await this.updateDescription(data.placeId, data.description);
        break;
    }
    return await this.getPlaceDetails(data.placeId);
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
          status: p.status,
        };
      }),
    );
    return {
      result: viewModel,
    };
  }

  private async updatePlaceLocation(
    placeId: number,
    location: UpdatePlaceLocation,
  ) {
    await this.placesRepositoryService.updatePlace(placeId, {
      country: location.country,
      lat: location.lat,
      lng: location.lng,
      streetName: location.streetName,
      city: location.city,
      googleId: location.googleId,
      postalCode: location.postalCode,
    });
  }

  private async updateDescription(placeId: number, description: string) {
    await this.placesRepositoryService.updatePlace(placeId, {
      description: description,
    });
  }

  private async updatePlaceInfo(placeId: number, data: UpdatePlaceInfo) {
    await this.placesRepositoryService.updatePlace(placeId, {
      name: data.name,
      phoneNumber: data.phoneNumber,
      priceRange: data.priceRange,
      facebook: data.facebook,
      instagram: data.instagram,
      tiktok: data.tiktok,
      website: data.website,
    });
  }

  private async updatePlaceType(placeId: number, weddingStep: WeddingSteps) {
    await this.placesRepositoryService.updatePlace(placeId, {
      step: weddingStep,
    });
  }

  private createPlaceDto(
    record: Selectable<Places>,
    step: CreatePlaceSteps,
  ): CreatePlaceDto {
    return {
      step: step,
      placeId: record.id,
      weddingStep: record.step,
    };
  }
}
