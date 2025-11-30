import { Injectable } from '@nestjs/common';
import {
  CreatePlaceRequest,
  CreatePlaceSteps,
  PlacePrice,
  PlaceStatus,
  UpdatePlaceLocation,
  UpdatePlaceRequest,
  VendorPlaceDetailsDto,
  VendorPlaceDetailsViewModel,
  VendorPlaceInfo,
  VendorPlaceListDto,
  VendorPlaceSocialMedia,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { Money } from '../common/Money';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { Places } from 'kysely-codegen';
import { Selectable } from 'kysely';
import { PhotosDto } from '../types/planner/photos.dto';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly photosService: PhotosService,
  ) {}

  public async getPlaceDetails(
    placeId: number,
  ): Promise<VendorPlaceDetailsViewModel> {
    const placeRecord =
      await this.placesRepositoryService.getPlaceById(placeId);

    const mainPhoto: PhotosDto =
      await this.photosService.getMainPhotoOrFirstByPlaceId(
        placeRecord.id,
        PhotoSize.Small,
      );

    const details: VendorPlaceDetailsDto =
      this.organizePlaceDetails(placeRecord);

    return {
      place: details,
      photos: [mainPhoto],
    };
  }

  public async updateStatus(placeId: number, status: PlaceStatus) {
    await this.placesRepositoryService.updateStatusById(placeId, {
      status: status,
    });
  }

  public async createPlace(
    userId: number,
    data: CreatePlaceRequest,
  ): Promise<VendorPlaceDetailsViewModel> {
    const createdPlaceRecord = await this.placesRepositoryService.createPlace({
      userId,
      step: data.weddingStep,
    });

    const details: VendorPlaceDetailsDto =
      this.organizePlaceDetails(createdPlaceRecord);

    return {
      place: details,
      photos: [],
    };
  }

  public async updatePlace(
    data: UpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsViewModel> {
    const photos = await this.photosService.getPhotosByPlaceId(
      data.placeId,
      PhotoSize.Small,
    );

    let updatedPlaceRecord: Selectable<Places>;
    switch (data.createStep) {
      case CreatePlaceSteps.PickPlaceType:
        updatedPlaceRecord = await this.updatePlaceType(
          data.placeId,
          data.weddingStep,
        );
        break;
      case CreatePlaceSteps.FillPlaceInfo:
        updatedPlaceRecord = await this.updatePlaceInfo(
          data.placeId,
          data.placeInfo,
        );
        break;
      case CreatePlaceSteps.AddSocialMedia:
        updatedPlaceRecord = await this.updateSocialMedia(
          data.placeId,
          data.socialMedia,
        );
        break;
      case CreatePlaceSteps.PickPlaceLocation:
        updatedPlaceRecord = await this.updatePlaceLocation(
          data.placeId,
          data.location,
        );
        break;
      case CreatePlaceSteps.AddDescription:
        updatedPlaceRecord = await this.updateDescription(
          data.placeId,
          data.description,
        );
        break;
    }
    const details: VendorPlaceDetailsDto =
      this.organizePlaceDetails(updatedPlaceRecord);
    return {
      place: details,
      photos: photos,
    };
  }

  public async getPlaces(userId: number): Promise<VendorPlaceViewModel> {
    const places =
      await this.placesRepositoryService.getAllPlacesByUserId(userId);

    const viewModel: VendorPlaceListDto[] = await Promise.all(
      places.map(async (p) => {
        const photo: PhotosDto =
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

  private organizePlaceDetails(
    details: Selectable<Places>,
  ): VendorPlaceDetailsDto {
    return {
      placeId: details.id,
      weddingStep: details.step,

      placeInfo: {
        name: details.name,
        phoneNumber: details.phoneNumber,
        priceRange: details.priceRange,
      },

      socialMedia: {
        website: details.website,
        tiktok: details.tiktok,
        instagram: details.instagram,
        facebook: details.facebook,
      },

      description: details.description,

      location: {
        streetName: details.streetName,
        city: details.city,
        country: details.country,
        postalCode: details.postalCode,
        googleId: details.googleId,
        lat: details.lat,
        lng: details.lng,
      },
    };
  }

  private async updatePlaceLocation(
    placeId: number,
    location: UpdatePlaceLocation,
  ) {
    return await this.placesRepositoryService.updatePlace(placeId, {
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
    return await this.placesRepositoryService.updatePlace(placeId, {
      description: description,
    });
  }

  private async updatePlaceInfo(placeId: number, data: VendorPlaceInfo) {
    return await this.placesRepositoryService.updatePlace(placeId, {
      name: data.name,
      phoneNumber: data.phoneNumber,
      priceRange: data.priceRange,
    });
  }

  private async updateSocialMedia(
    placeId: number,
    data: VendorPlaceSocialMedia,
  ) {
    return await this.placesRepositoryService.updatePlace(placeId, {
      website: data.website,
      tiktok: data.tiktok,
      instagram: data.instagram,
      facebook: data.facebook,
    });
  }

  private async updatePlaceType(
    placeId: number,
    weddingStep: WeddingSteps,
  ): Promise<Selectable<Places>> {
    return await this.placesRepositoryService.updatePlace(placeId, {
      step: weddingStep,
    });
  }
}
