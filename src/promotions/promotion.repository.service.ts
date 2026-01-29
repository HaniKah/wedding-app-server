import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Promotions } from '../types/db/db';
import { Insertable } from 'kysely';

@Injectable()
export class PromotionRepositoryService {
  constructor(private readonly db: DbService) {}

  public async createPromotion(data: Insertable<Promotions>) {
    await this.db.db.insertInto('promotions').values(data).execute();
  }
}
