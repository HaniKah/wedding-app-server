import { Injectable } from '@nestjs/common';

import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, PlaceFilter } from 'src/types/db/db';
import { DbService } from '../db/db.service';

@Injectable()
export class PlaceFilterRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }
  public async removeAllPicked(userId: number) {
    await this.db
      .updateTable('placeFilter')
      .set('isPicked', false)
      .where('userId', '=', userId)
      .execute();
  }
  public async getPlaceFilterOfPickedSteps(userId: number) {
    return await this.db
      .selectFrom('placeFilter')
      .selectAll()
      .rightJoin('places', 'places.id', 'placeFilter.placeId')
      .select('places.step')
      .where('placeFilter.userId', '=', userId)
      .where('placeFilter.isPicked', '=', true)
      .execute();
  }

  public async getPlaceFilter(userId: number, placeId: number) {
    return await this.db
      .selectFrom('placeFilter')
      .selectAll()
      .where('userId', '=', userId)
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
