import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { WebhookJwtAuthGuard } from '../auth/guards/webhook-jwt-auth/webhook-jwt-auth.guard';
import {
  RevenueCatRequest,
  WebHooksEventType,
} from '../types/webhooks/revenue-cat.dto';
import { PromotionsService } from '../promotions/promotions.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Public() // skips the user jwt auth
  @HttpCode(200)
  @UseGuards(WebhookJwtAuthGuard)
  @Post('revenue-cat')
  public async revenueCatWebhook(@Body() body: RevenueCatRequest) {
    if (body.event.type === WebHooksEventType.NON_RENEWING_PURCHASE) {
      await this.promotionsService.createPromotion({
        promotion: {
          placeId: body.event.subscriber_attributes.placeId.value,
          price: body.event.price,
          purchasedAt: new Date(body.event.purchased_at_ms),
          productId: body.event.product_id,
          priceInPurchaseCurrency: body.event.price_in_purchased_currency,
        },
        place: {
          placeId: body.event.subscriber_attributes.placeId.value,
          promotionBeginsAt:
            body.event.subscriber_attributes.promotionBeginsAt.value,
          promotionEndsAt:
            body.event.subscriber_attributes.promotionEndsAt.value,
          saleLabel: body.event.subscriber_attributes.saleLabel.value,
          salePercentage: body.event.subscriber_attributes.salePercentage.value,
        },
      });
    }
    //response has to be sent back within 60 sec , otherwise RC will call again
    return {};
  }
}
