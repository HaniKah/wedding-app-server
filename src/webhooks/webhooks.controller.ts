import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { WebhookJwtAuthGuard } from '../auth/guards/webhook-jwt-auth/webhook-jwt-auth.guard';
import { RevenueCatRequest } from '../types/webhooks/revenue-cat.dto';
import { PlacesService } from '../places/places.service';
import { PromotionsService } from '../promotions/promotions.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(
    private readonly placesService: PlacesService,
    private readonly promotionService: PromotionsService,
  ) {}

  @Public() // skips the user jwt auth
  @HttpCode(200)
  @UseGuards(WebhookJwtAuthGuard)
  @Post('revenue-cat')
  public revenueCatWebhook(@Body() body: RevenueCatRequest) {
    //Unfortunately having a webhook here is not useful we couldn't attach custom data to the purchase with RC ,the implementation goes as following:
    // use makes a purchase through the sdk in a client, we check if the entitlement exists, we make another separate post-request to the promotion controller which stores required data
    console.log('webhook received with type :', body.event.type);
    return {};
  }
}
