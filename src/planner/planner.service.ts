import { Injectable } from '@nestjs/common';
import { PlaceDetailsDto, PlacesViewModel } from '../types/planner/places.dto';
import { WeddingDateDto } from '../types/planner/weddingDateDto';
import { PlansRepositoryService } from './plans.repository.service';
import { PlannerRepositoryService } from './planner.repository.service';
import { PhotosService } from '../photos/photos.service';
import { PhotoSize } from '../types/photos/photos.dto';
import { CountryCode } from '../types/general/countries.dto';
import { SaleLabel } from '../types/webhooks/revenue-cat.dto';
import { Categories } from '../types/general/categories';
import { FavoritePlaceDto } from '../types/planner/favorites.dto';

@Injectable()
export class PlannerService {
  constructor(
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
  public async getWeddingDate(userId: number): Promise<WeddingDateDto> {
    const planRecord =
      await this.plansRepositoryService.getPlanByUserIdOrThrow(userId);
    return {
      date: planRecord?.weddingDate?.toLocaleDateString('en-CA') || null,
    };
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
        const mainPhoto = await this.photosService.getMainPhotoOrFirstByPlaceId(
          r.id,
          PhotoSize.Medium,
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
          mainPhoto: mainPhoto?.uri,
          mainPhotoBlurhash: mainPhoto?.blurhash,
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

  public async getPlaceDetailsById(placeId: number): Promise<PlaceDetailsDto> {
    const place =
      await this.plannerRepositoryService.getPlaceByIdOrThrow(placeId);

    const mainPhoto = await this.photosService.getMainPhotoOrFirstByPlaceId(
      place.id,
      PhotoSize.Medium,
    );
    const { count } =
      await this.photosService.getAvailablePhotosNumber(placeId);

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
      photosCount: count,
      mainPhoto: mainPhoto?.uri,
      mainPhotoBlurhash: mainPhoto?.blurhash,
      maxPrice: place.maxPrice,
      minPrice: place.minPrice,
      description: place.description,
      countryCode: place.country,
      city: place.city,
      priceType: place.priceType,
    };
  }
  public async getFavorites(id: number): Promise<FavoritePlaceDto> {
    try {
      const p = await this.plannerRepositoryService.getPlaceByIdOrThrow(id);
      if (p.isPublished || p.deletedAt === null) {
        const mainPhoto = await this.photosService.getMainPhotoOrFirstByPlaceId(
          p.id,
          PhotoSize.Thumbnail,
        );
        return {
          id: id,
          isFound: !!p,
          name: p?.name,
          thumbnail: mainPhoto?.uri,
          thumbnailBlurhash: mainPhoto?.blurhash,
          minPrice: p?.minPrice,
          maxPrice: p?.maxPrice,
          priceType: p?.priceType,
          category: p?.step,
          country: p?.country,
        };
      } else {
        throw new Error('place is not published');
      }
    } catch {
      return {
        id: id,
        isFound: false,
        name: null,
        thumbnail: null,
        minPrice: null,
        maxPrice: null,
        priceType: null,
        category: null,
        country: null,
      };
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
