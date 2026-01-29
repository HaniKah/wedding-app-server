import { Body, Controller, Post } from '@nestjs/common';
import { CreatePromotionRequest } from '../types/promotions/promotions.dto';
import { PromotionsService } from './promotions.service';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}
  @Post('create')
  public async create(@Body() body: CreatePromotionRequest) {
    await this.promotionsService.createPromotion(body);
  }
}
