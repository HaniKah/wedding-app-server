export class CreatePromotionRequest {
  place: PlaceRequest;
  promotion: PromoteRequest;
}
export class PlaceRequest {
  placeId: string;
  promotionBeginsAt: string;
  promotionEndsAt: string;
  saleLabel: string;
  salePercentage: string;
}
export class PromoteRequest {
  placeId: string;
  price: number;
  priceInPurchaseCurrency: number;
  productId: string;
  purchasedAt: Date;
}
