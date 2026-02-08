import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

import { Places } from 'src/types/db/db';
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
    const now = new Date();
    return await this.db.db
      .selectFrom('places')
      .selectAll()
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .orderBy((eb) =>
        eb
          .case()
          .when(
            eb.and([
              eb('places.promotionBeginsAt', '<=', now),
              eb('places.promotionEndsAt', '>=', now),
            ]),
          )
          .then(0)
          .else(1)
          .end(),
      )
      .orderBy('places.promotionBeginsAt', 'desc')
      .execute();
  }
  public async updatePlace(placeId: number, data: Updateable<Places>) {
    await this.db.db
      .updateTable('places')
      .where('id', '=', placeId)
      .set(data)
      .executeTakeFirst();
  }
}
