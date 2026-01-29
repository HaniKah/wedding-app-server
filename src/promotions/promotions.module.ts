import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PromotionRepositoryService } from './promotion.repository.service';

@Module({
  providers: [PromotionsService, PromotionRepositoryService],
  controllers: [PromotionsController],
})
export class PromotionsModule {}
