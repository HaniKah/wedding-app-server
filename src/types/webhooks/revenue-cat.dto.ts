export class RevenueCatRequest {
  api_version: string;
  event: RevenueCatEvent;
}
export class RevenueCatEvent {
  event_timestamp_ms: number;
  product_id: string;
  purchased_at_ms: number;
  expiration_at_ms: number;
  environment: string;
  entitlement_id: string;
  entitlement_ids: string[];
  presented_offering_id: string;
  transaction_id: string;
  original_transaction_id: string;
  is_family_share: boolean;
  country_code: string;
  app_user_id: string;
  aliases: string[];
  original_app_user_id: string;
  is_trial_conversion: boolean;
  price: number;
  price_in_purchased_currency: number;
  subscriber_attributes: SubscriberAttributes;
  store: string;
  takehome_percentage: number;
  offer_code: string;
  tax_percentage: number;
  commission_percentage: number;
  metadata: any;
  renewal_number: number;
  type: WebHooksEventType;
  id: string;
  app_id: string;
}
export class SubscriberAttributes {
  placeId: SubscriberAttributesDto;
  saleLabel: SubscriberAttributesDto;
  salePercentage: SubscriberAttributesDto;
  promotionBeginsAt: SubscriberAttributesDto;
  promotionEndsAt: SubscriberAttributesDto;
}
export class SubscriberAttributesDto {
  value: string;
  updated_at_ms: number;
}
export enum WebHooksEventType {
  TEST = 'TEST',
  INITIAL_PURCHASE = 'INITIAL_PURCHASE',
  RENEWAL = 'RENEWAL',
  CANCELLATION = 'CANCELLATION',
  UNCANCELLATION = 'UNCANCELLATION',
  NON_RENEWING_PURCHASE = 'NON_RENEWING_PURCHASE',
  SUBSCRIPTION_PAUSED = 'SUBSCRIPTION_PAUSED',
  EXPIRATION = 'EXPIRATION',
  BILLING_ISSUE = 'BILLING_ISSUE',
  PRODUCT_CHANGE = 'PRODUCT_CHANGE',
  TRANSFER = 'TRANSFER',
  SUBSCRIPTION_EXTENDED = 'SUBSCRIPTION_EXTENDED',
  TEMPORARY_ENTITLEMENT_GRANT = 'TEMPORARY_ENTITLEMENT_GRANT',
  REFUND_REVERSED = 'REFUND_REVERSED',
  INVOICE_ISSUANCE = 'INVOICE_ISSUANCE',
  VIRTUAL_CURRENCY_TRANSACTION = 'VIRTUAL_CURRENCY_TRANSACTION',
  EXPERIMENT_ENROLLMENT = 'EXPERIMENT_ENROLLMENT',
}
export enum SaleLabel {
  Sale = 'Sale',
  Buy1Get1Free = 'Buy1Get1Free',
}
