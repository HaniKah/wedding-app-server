import { Injectable } from '@nestjs/common';
import { CreatePromotionRequest } from '../types/promotions/promotions.dto';
import { PromotionRepositoryService } from './promotion.repository.service';
import { PlacesRepositoryService } from '../places/places.repository.service';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly promotionRepositoryService: PromotionRepositoryService,
    private readonly placeRepositoryService: PlacesRepositoryService,
  ) {}
  public async createPromotion({ place, promotion }: CreatePromotionRequest) {
    await this.promotionRepositoryService.createPromotion({
      placeId: promotion.placeId,
      price: promotion.price,
      priceInPurchasedCurrency: promotion.priceInPurchaseCurrency,
      productId: promotion.productId,
      purchasedAt: promotion.purchasedAt,
    });
    await this.placeRepositoryService.updatePlace(place.placeId, {
      promotionBeginsAt: place.promotionBeginsAt,
      promotionEndsAt: place.promotionEndsAt,
      saleLabel: place.saleLabel,
      salePercentage: place.salePercentage,
    });
  }
}
