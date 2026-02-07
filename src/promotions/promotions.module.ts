import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PromotionRepositoryService } from './promotion.repository.service';
import { PlacesModule } from '../places/places.module';

@Module({
  providers: [PromotionsService, PromotionRepositoryService],
  controllers: [PromotionsController],
  exports: [PromotionsService],
  imports: [PlacesModule],
})
export class PromotionsModule {}
