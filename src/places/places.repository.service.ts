import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';

import { Places } from 'kysely-codegen';
import { Insertable } from 'kysely';

@Injectable()
export class PlacesRepositoryService {
  constructor(private readonly db: DbService) {}
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
      .execute();
  }
}
