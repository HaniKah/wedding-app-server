import { Injectable } from '@nestjs/common';
import {
  FavouritePlacesDto,
  FavouritePlacesViewModel,
  PlaceDetailsDto,
  PlacesViewModel,
  ToggleFavoritePlaceFilterRequest,
  TogglePickedPlaceFilterRequest,
} from '../types/planner/places.dto';
import { WeddingDateDto } from '../types/planner/weddingDateDto';
import { PlansRepositoryService } from './plans.repository.service';
import { PlaceFilterRepositoryService } from './placeFilter.repository.service';
import { PlannerRepositoryService } from './planner.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { CountryCode } from '../types/general/countries.dto';
import { SaleLabel } from '../types/webhooks/revenue-cat.dto';
import { PlaceFilter } from 'src/types/db/db';
import { Updateable } from 'kysely';
import { Categories } from '../types/general/categories';

@Injectable()
export class PlannerService {
  constructor(
    private readonly placeFilterRepositoryService: PlaceFilterRepositoryService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private readonly plannerRepositoryService: PlannerRepositoryService,
    private readonly photosService: PhotosService,
  ) {}

  public async updateWeddingDate(userId: number, date: Date): Promise<void> {
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    await this.plansRepositoryService.updatePlan(planRecord.id, {
      weddingDate: date,
    });
  }
  public async getFavorites(userId: number): Promise<FavouritePlacesViewModel> {
    const filters =
      await this.placeFilterRepositoryService.getFavoritePlaces(userId);

    const favPlaces: FavouritePlacesDto[] = await Promise.all(
      filters.map(async (p) => {
        const mainPhoto = await this.photosService.getMainPhotoOrFirstByPlaceId(
          p.placeId,
          PhotoSize.Thumbnail,
        );
        return {
          id: p.id,
          name: p.name,
          category: p.step,
          country: p.country,
          mainPhoto: mainPhoto,
          minPrice: p.minPrice,
          maxPrice: p.maxPrice,
        };
      }),
    );
    return {
      result: favPlaces,
    };
  }

  public async getWeddingDate(userId: number): Promise<WeddingDateDto> {
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    return {
      date: planRecord?.weddingDate?.toLocaleDateString('en-CA') || null,
    };
  }

  public async toggleFavorite(
    userId: number,
    req: ToggleFavoritePlaceFilterRequest,
  ) {
    await this.updateOrCreatePlaceFilter(userId, {
      placeId: req.placeId,
      isFavorite: req.favorite,
    });
  }

  public async togglePicked(
    userId: number,
    req: TogglePickedPlaceFilterRequest,
  ) {
    await this.placeFilterRepositoryService.removeAllPickedOfSameStep(
      userId,
      req.category,
    );

    await this.updateOrCreatePlaceFilter(userId, {
      placeId: req.placeId,
      isPicked: req.picked,
    });
  }

  public async getPlaces(
    countryCode: CountryCode,
    offset: number,
    searchQuery?: string,
    category?: Categories,
  ): Promise<PlacesViewModel> {
    const placesAndPlaceDetailsRecord =
      await this.plannerRepositoryService.getAllPlaces(
        countryCode,
        offset,
        searchQuery,
        category,
      );

    const list = await Promise.all(
      placesAndPlaceDetailsRecord.map(async (r) => {
        const mainPhoto: string =
          await this.photosService.getMainPhotoOrFirstByPlaceId(
            r.id,
            PhotoSize.Thumbnail,
          );
        const isPromoted: boolean =
          r.promotionBeginsAt <= new Date() && r.promotionEndsAt >= new Date();
        const label: string =
          isPromoted && this.createLabelContent(r.saleLabel, r.salePercentage);
        return {
          id: r.id,
          category: r.step,
          name: r.name,
          formattedAddress: r.streetName,
          mainPhoto: mainPhoto,
          maxPrice: r.maxPrice,
          minPrice: r.minPrice,
          isPromoted: isPromoted,
          label: label,
          phoneNumber: r.phoneNumber,
          priceType: r.priceType,
          country: r.country,
          city: r.city,
        };
      }),
    );

    return { places: list };
  }

  public async getPlaceDetailsById(
    userId: number,
    placeId: number,
  ): Promise<PlaceDetailsDto> {
    const place =
      await this.plannerRepositoryService.getPlaceByIdOrThrow(placeId);
    const filters = await this.placeFilterRepositoryService.getPlaceFilter(
      userId,
      placeId,
    );

    const mainPhoto: string =
      await this.photosService.getMainPhotoOrFirstByPlaceId(
        place.id,
        PhotoSize.Thumbnail,
      );

    return {
      id: place.id,
      name: place.name,
      address: `${place.streetName}, ${place.city}, ${place.country}`,
      phoneNumber: place?.phoneNumber,
      website: place?.website,
      facebook: place?.facebook,
      instagram: place?.instagram,
      tiktok: place?.tiktok,
      category: place.step as Categories,
      picked: filters?.isPicked || false,
      favourite: filters?.isFavorite || false,
      mainPhoto: mainPhoto,
      maxPrice: place.maxPrice,
      minPrice: place.minPrice,
      description: place.description,
      countryCode: place.country,
      city: place.city,
      priceType: place.priceType,
    };
  }

  // public async getSteps(userId: number): Promise<StepsViewModel> {
  //   //todo : ignored steps are not implemented yet
  //   const stepsList: Categories[] = Object.values(Categories);
  //
  //   const completedStepsRecord =
  //     await this.placeFilterRepositoryService.getPlaceFilterOfPickedSteps(
  //       userId,
  //     );
  //
  //   let note: string;
  //   const progress =
  //     Math.floor((completedStepsRecord.length / stepsList.length) * 100) / 100;
  //
  //   const dtoList = await Promise.all(
  //     stepsList.map(async (step) => {
  //       let isCompleted: boolean = false;
  //       const pickedPlace = completedStepsRecord.find((s) => s.step === step);
  //       if (pickedPlace && pickedPlace.placeId) {
  //         const placeDetails = await this.getPlaceDetailsById(
  //           userId,
  //           pickedPlace.placeId,
  //         );
  //         note = placeDetails.name;
  //         isCompleted = true;
  //       } else {
  //         note = progress * 100 + '% completed';
  //       }
  //       return {
  //         step,
  //         title: stepsInfo[step].title,
  //         description: stepsInfo[step].description,
  //         isCompleted: isCompleted,
  //         note: note,
  //       };
  //     }),
  //   );
  //
  //   return {
  //     steps: dtoList,
  //     progress: progress,
  //   };
  // }

  // public async createChecklist(userId: number): Promise<ChecklistViewModel> {
  //   //todo : ignored steps are not implemented yet
  //   const stepsList: Categories[] = Object.values(Categories);
  //
  //   const completedStepsRecord =
  //     await this.placeFilterRepositoryService.getPlaceFilterOfPickedSteps(
  //       userId,
  //     );
  //
  //   let placeName: string | null = null;
  //   let placeId: number | null = null;
  //
  //   const dtoList: ChecklistDto[] = await Promise.all(
  //     stepsList.map(async (step) => {
  //       let isCompleted: boolean = false;
  //       const found = completedStepsRecord.find((s) => s.step === step);
  //
  //       if (found && found.placeId) {
  //         const placeDetails = await this.getPlaceDetailsById(
  //           userId,
  //           found.placeId,
  //         );
  //         placeName = placeDetails.name;
  //         placeId = found.placeId;
  //         isCompleted = true;
  //       }
  //
  //       return {
  //         step,
  //         isCompleted: isCompleted,
  //         placeName: placeName,
  //         placeId: placeId,
  //       };
  //     }),
  //   );
  //
  //   return {
  //     list: dtoList,
  //   };
  // }

  private async updateOrCreatePlaceFilter(
    userId: number,
    request: Updateable<PlaceFilter>,
  ): Promise<void> {
    const filtersRecord =
      await this.placeFilterRepositoryService.getPlaceFilter(
        userId,
        request.placeId,
      );

    if (filtersRecord) {
      await this.placeFilterRepositoryService.updatePlaceFilterById(
        filtersRecord.id,
        request,
      );
    } else {
      //todo optimization: here we are updating unnecessary fields
      await this.placeFilterRepositoryService.createPlaceFilter({
        userId: userId,
        placeId: request.placeId,
        isPicked: request.isPicked,
        isFavorite: request.isFavorite,
      });
    }
  }

  private createLabelContent(saleLabel: SaleLabel, percentage: string): string {
    switch (saleLabel) {
      case SaleLabel.Sale:
        //todo converting number here doesnt make much of sense , implement converting using transformers in kysely with decimal.js maybe ?
        return `${Number(percentage) * 100}% Off`;
      case SaleLabel.Buy1Get1Free:
        return `Buy 1 get 1 free`;
      default:
        return 'Premium';
    }
  }
}
