export class CreatePromotionRequest {
  placeId: number;
  packageId: string;
  productId: string;
  transactionId: string;
  purchaseId: string;
  createdAt: Date;
  expiredAt: Date;
  promotionType: string; // PromotionType type
  saleLabel: string; //SaleLabel type
  percentage: number;
  managementUrl: string;
}
