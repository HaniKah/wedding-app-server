import { Controller, Get } from '@nestjs/common';

@Controller('promotions')
export class PromotionsController {
  @Get('getAll')
  public async getPromotionsHistory() {}
}
