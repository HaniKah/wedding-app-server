export class CreatePromotionRequest {
  place: PlaceRequest;
  promotion: PromoteRequest;
}
export class PlaceRequest {
  placeId: number;
  promotionBeginsAt: Date;
  promotionEndsAt: Date;
  saleLabel: string;
  salePercentage: string;
}
export class PromoteRequest {
  placeId: number;
  price: number;
  priceInPurchaseCurrency: number;
  productId: string;
  purchasedAt: Date;
}
