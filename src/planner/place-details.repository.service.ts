import { Injectable } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, PlaceFilter } from 'src/types/db/db';
import { DbService } from '../db/db.service';

@Injectable()
export class PlaceDetailsRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }
  public async removeAllPicked(planId: number, step: WeddingSteps) {
    await this.db
      .updateTable('placeFilter')
      .set('picked', false)
      .where('step', '=', step)
      .where('planId', '=', planId)
      .execute();
  }
  public async getPlaceFilterOfCompletedSteps(planId: number) {
    return await this.db
      .selectFrom('placeFilter')
      .selectAll()
      .where('planId', '=', planId)
      .where('picked', '=', true)
      .execute();
  }

  public async getPlaceFilter(planId: number) {
    return await this.db
      .selectFrom('placeFilter')
      .selectAll()
      .where('planId', '=', planId)
      .execute();
  }

  public async getPlaceFilterByPlaceId(placeId: number) {
    return await this.db
      .selectFrom('placeFilter')
      .selectAll()
      .where('placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async createPlaceFilter(place: Insertable<PlaceFilter>) {
    await this.db.insertInto('placeFilter').values(place).executeTakeFirst();
  }

  public async updatePlaceFilterById(
    id: number,
    place: Updateable<PlaceFilter>,
  ) {
    await this.db
      .updateTable('placeFilter')
      .set(place)
      .where('id', '=', id)
      .executeTakeFirst();
  }
}
