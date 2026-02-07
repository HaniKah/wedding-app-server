import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PromotionsModule } from '../promotions/promotions.module';
import { PlacesModule } from '../places/places.module';

@Module({
  controllers: [WebhooksController],
  imports: [PromotionsModule, PlacesModule],
})
export class WebhooksModule {}
