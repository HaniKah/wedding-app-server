import { Injectable } from '@nestjs/common';
import { CreatePromotionRequest } from '../types/promotions/promotions.dto';
import { PromotionRepositoryService } from './promotion.repository.service';

@Injectable()
export class PromotionsService {
  constructor(private promotionRepositoryService: PromotionRepositoryService) {}
  public async createPromotion(data: CreatePromotionRequest) {
    await this.promotionRepositoryService.createPromotion({
      placeId: data.placeId,
      createdAt: data.createdAt,
      expiredAt: data.expiredAt,
      type: data.promotionType,
      // entitlement: data.entitelements,
      label: data.saleLabel,
      managementUrl: data.managementUrl,
      percentage: data.percentage,
      productId: data.productId,
      purchaseId: data.purchaseId,
      transactionId: data.transactionId,
    });
  }
}
