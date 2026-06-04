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
import { normalizePlacesFeatures } from '../types/places/features.dto';

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
          country: req.placeInfo?.countryCode,
          city: req.placeInfo?.city,
        });
        break;
      }
      case UpdateStep.AddFeatures:
        await this.placesRepositoryService.updatePlace(req.id, {
          features: normalizePlacesFeatures(
            req.features.category,
            req.features.features,
          ),
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
      category: p.step,
      minPrice: p.minPrice?.getFormatted(),
      maxPrice: p.maxPrice?.getFormatted(),
      priceType: p.priceType,
      countryCode: p.country,
      city: p.city,
      features: normalizePlacesFeatures(p.step, p.features),
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
      country: data.placeInfo.countryCode,
      city: data.placeInfo.city,
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
        const photo = await this.photosService.getMainPhotoOrFirstByPlaceId(
          p.id,
          PhotoSize.Thumbnail,
        );
        return {
          id: p.id,
          name: p.name,
          streetName: p.streetName,
          thumbnail: photo?.uri,
          thumbnailBlurhash: photo?.blurhash,
          isPublished: p.isPublished,
          isPromoted:
            today >= p.promotionBeginsAt && today <= p.promotionEndsAt,
          minPrice: p.minPrice?.getFormatted(),
          maxPrice: p.maxPrice?.getFormatted(),
          priceType: p.priceType,
          city: p.city,
          country: p.country,
          category: p.step,
        };
      }),
    );
    const [published, unpublished] = placesDto.reduce(
      (
        [published, unpublished]: [VendorPlaceDto[], VendorPlaceDto[]],
        place,
      ) => {
        if (place.isPublished) {
          published.push(place);
        } else {
          unpublished.push(place);
        }
        return [published, unpublished];
      },
      [[], []],
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
    };
  }
}
