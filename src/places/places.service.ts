import { Injectable } from '@nestjs/common';
import {
  CreatePlaceRequest,
  PlaceStatus,
  UpdatePlaceRequest,
  UpdateStep,
  VendorPlaceDetailsDto,
  VendorPlaceDto,
  VendorPlaceViewModel,
} from '../types/places/places.dto';
import { PlacesRepositoryService } from './places.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';

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
      case UpdateStep.PickPlaceType:
        await this.placesRepositoryService.updatePlace(req.id, {
          step: req.type,
        });
        break;
      case UpdateStep.FillPlaceInfo:
        await this.placesRepositoryService.updatePlace(req.id, {
          name: req.placeInfo.name,
          phoneNumber: req.placeInfo.phoneNumber,
          facebook: req.placeInfo.facebook,
          instagram: req.placeInfo.instagram,
          tiktok: req.placeInfo.tiktok,
          website: req.placeInfo.website,
          minPrice: req.placeInfo.minPrice,
          maxPrice: req.placeInfo.maxPrice,
          priceType: req.placeInfo.priceType,
        });
        break;
      case UpdateStep.PickPlaceLocation:
        await this.placesRepositoryService.updatePlace(req.id, {
          streetName: req.location?.streetName,
          lng: req.location?.lng,
          lat: req.location?.lat,
          city: req.location?.city,
          googleId: req.location?.googleId,
          country: req.location?.country,
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
        PhotoSize.Small,
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
      currency: p.currency,
      status: p.status,
      description: p.description,
      mainPhoto: mainPhoto,
      step: p.step,
      minPrice: p.minPrice,
      maxPrice: p.maxPrice,
      priceType: p.priceType,
    };
  }

  public async updateStatus(placeId: number, status: PlaceStatus) {
    await this.placesRepositoryService.updatePlace(placeId, {
      status: status,
    });
  }

  public async createPlace(
    userId: number,
    data: CreatePlaceRequest,
  ): Promise<VendorPlaceDetailsDto> {
    const placeRecord = await this.placesRepositoryService.createPlace({
      userId: userId,
      step: data.type,
    });
    return await this.getPlaceDetails(placeRecord.id);
  }

  public async getPlaces(userId: number): Promise<VendorPlaceViewModel> {
    const places =
      await this.placesRepositoryService.getAllPlacesByUserId(userId);

    const placesDto: VendorPlaceDto[] = await Promise.all(
      places.map(async (p) => {
        const photo: string =
          await this.photosService.getMainPhotoOrFirstByPlaceId(
            p.id,
            PhotoSize.Small,
          );

        return {
          id: p.id,
          name: p.name,
          streetName: p.streetName,
          thumbnail: photo,
          currency: p.currency,
          status: p.status,
          minPrice: p.minPrice,
          maxPrice: p.maxPrice,
        };
      }),
    );
    const [published, unpublished] = placesDto.reduce(
      (
        [published, unpublished]: [VendorPlaceDto[], VendorPlaceDto[]],
        place,
      ) => {
        if (place.status === PlaceStatus.Published) {
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
        title: PlaceStatus.Published,
        data: published,
      },
      unpublished: {
        title: PlaceStatus.Unpublished,
        data: unpublished,
      },
    };
  }
}
