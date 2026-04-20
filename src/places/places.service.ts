import { Injectable } from '@nestjs/common';
import {
  CreatePlaceRequest,
  UpdatePlaceRequest,
  UpdateStep,
  VendorPlaceDetailsDto,
  VendorPlaceDto,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { Selectable } from 'kysely';
import { Places } from '../types/db/db';

@Injectable()
export class PlacesService {
  constructor(
    private readonly placesRepositoryService: PlacesRepositoryService,
    private readonly photosService: PhotosService,
  ) {}

  public async editPlace(
    req: UpdatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    switch (req.updateStep) {
      case UpdateStep.FillPlaceInfo: {
        await this.placesRepositoryService.updatePlace(req.id, {
          name: req.placeInfo.name,
          phoneNumber: req.placeInfo.phoneNumber,
          minPrice: req.placeInfo.minPrice,
          maxPrice: req.placeInfo.maxPrice,
          priceType: req.placeInfo.priceType,
          step: req.placeInfo.category,
        });
        break;
      }
      case UpdateStep.PickPlaceLocation:
        await this.placesRepositoryService.updatePlace(req.id, {
          streetName: req.location?.streetName,
          lng: req.location?.lng,
          lat: req.location?.lat,
          city: req.location?.city,
          googleId: req.location?.googleId,
          country: req.location?.countryCode,
          postalCode: req.location?.postalCode,
        });
        break;
      case UpdateStep.AddDescription:
        await this.placesRepositoryService.updatePlace(req.id, {
          description: req.description,
        });
    }
    return await this.getPlaceDetails(req.id);
  }

  public async deletePlace(placeId: number) {
    await this.placesRepositoryService.deletePlace(placeId);
  }

  public async getPlaceDetails(
    placeId: number,
  ): Promise<VendorPlaceDetailsDto> {
    const p = await this.placesRepositoryService.getPlaceById(placeId);

    const mainPhoto: string =
      await this.photosService.getMainPhotoOrFirstByPlaceId(
        p.id,
        PhotoSize.Thumbnail,
      );

    return {
      id: p.id,
      name: p.name,
      streetName: p.streetName,
      phoneNumber: p.phoneNumber,
      facebook: p.facebook,
      instagram: p.instagram,
      tiktok: p.tiktok,
      website: p.website,
      isPublished: p.isPublished,
      description: p.description,
      mainPhoto: mainPhoto,
      category: p.step,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      priceType: p.priceType,
      countryCode: p.country,
      city: p.city,
    };
  }

  public async updateStatus(placeId: number, isPublished: boolean) {
    await this.placesRepositoryService.updatePlace(placeId, {
      isPublished: isPublished,
    });
  }

  public async createPlace(
    userId: number,
    data: CreatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    const placeRecord = await this.placesRepositoryService.createPlace({
      userId: userId,
      name: data.placeInfo.name,
      step: data.placeInfo.category,
      phoneNumber: data.placeInfo.phoneNumber,
      country: data.location.countryCode,
      city: data.location.city,
      minPrice: data.placeInfo.minPrice,
      maxPrice: data.placeInfo.maxPrice,
      priceType: data.placeInfo.priceType,
      isPublished: true,
    });
    return await this.getPlaceDetails(placeRecord.id);
  }

  public async getPlaces(userId: number): Promise<VendorPlaceViewModel> {
    const today = new Date();
    const places =
      await this.placesRepositoryService.getAllPlacesByUserId(userId);

    const placesDto: VendorPlaceDto[] = await Promise.all(
      places.map(async (p) => {
        const photo: string =
          await this.photosService.getMainPhotoOrFirstByPlaceId(
            p.id,
            PhotoSize.Thumbnail,
          );
        const isCompleted = this.isPlaceComplete(p) && photo !== null;

        return {
          id: p.id,
          name: p.name,
          streetName: p.streetName,
          thumbnail: photo,
          isPublished: p.isPublished,
          isCompleted: isCompleted,
          isPromoted:
            today >= p.promotionBeginsAt && today <= p.promotionEndsAt,
          minPrice: p.minPrice,
          maxPrice: p.maxPrice,
          city: p.city,
          country: p.country,
          category: p.step,
        };
      }),
    );
    const [published, unpublished, uncompleted] = placesDto.reduce(
      (
        [published, unpublished, uncompleted]: [
          VendorPlaceDto[],
          VendorPlaceDto[],
          VendorPlaceDto[],
        ],
        place,
      ) => {
        if (place.isCompleted) {
          if (place.isPublished) {
            published.push(place);
          } else {
            unpublished.push(place);
          }
        } else {
          uncompleted.push(place);
        }

        return [published, unpublished, uncompleted];
      },
      [[], [], []],
    );
    return {
      published: {
        title: 'Published',
        data: published,
      },
      unpublished: {
        title: 'Unpublished',
        data: unpublished,
      },
      uncompleted: {
        title: 'Uncompleted',
        data: uncompleted,
      },
    };
  }

  //todo: more accurate checks should happen here
  private isPlaceComplete(place: Selectable<Places>): boolean {
    return (
      place.name != null &&
      place.minPrice != null &&
      place.maxPrice != null &&
      place.phoneNumber != null
    );
  }
}
