import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { WebhookJwtAuthGuard } from '../auth/guards/webhook-jwt-auth/webhook-jwt-auth.guard';
import { RevenueCatRequest } from '../types/webhooks/revenue-cat.dto';

@Controller('webhooks')
export class WebhooksController {
  @Public() // skips the user jwt auth
  @HttpCode(200)
  @UseGuards(WebhookJwtAuthGuard)
  @Post('revenue-cat')
  public revenueCatWebhook(@Body() body: RevenueCatRequest) {
    console.log(body.event);
    return;
  }
}
