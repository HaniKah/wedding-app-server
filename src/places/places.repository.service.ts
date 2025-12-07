import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

import { Places } from 'kysely-codegen';
import { Insertable, Updateable } from 'kysely';

@Injectable()
export class PlacesRepositoryService {
  constructor(private readonly db: DbService) {}

  public async deletePlace(placeId: number) {
    await this.db.db
      .updateTable('places')
      .set('deletedAt', new Date().toISOString())
      .where('places.id', '=', placeId)
      .executeTakeFirstOrThrow();
  }

  public async getPlaceById(placeId: number) {
    return await this.db.db
      .selectFrom('places')
      .selectAll()
      .where('id', '=', placeId)
      .executeTakeFirst();
  }
  public async createPlace(data: Insertable<Places>) {
    return await this.db.db
      .insertInto('places')
      .values(data)
      .returning('id')
      .executeTakeFirst();
  }
  public async getAllPlacesByUserId(userId: number) {
    return await this.db.db
      .selectFrom('places')
      .selectAll()
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .execute();
  }
  public async updateStatusById(placeId: number, data: Updateable<Places>) {
    await this.db.db
      .updateTable('places')
      .where('id', '=', placeId)
      .set(data)
      .executeTakeFirst();
  }
}
