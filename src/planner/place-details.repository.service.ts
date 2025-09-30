import { Injectable } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, PlaceDetails } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlaceDetailsRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }
  public async removeAllPicked(planId: number, step: WeddingSteps) {
    await this.db
      .updateTable('placeDetails')
      .set('picked', false)
      .where('step', '=', step)
      .where('planId', '=', planId)
      .execute();
  }

  public async getCompletedSteps(planId: number) {
    return await this.db
      .selectFrom('placeDetails')
      .selectAll()
      .where('picked', '=', true)
      .where('planId', '=', planId)
      .execute();
  }

  public async getPlaceDetailsOfCompletedStep(
    step: WeddingSteps,
    planId: number,
  ) {
    return await this.db
      .selectFrom('placeDetails')
      .selectAll()
      .where('step', '=', step)
      .where('picked', '=', true)
      .where('planId', '=', planId)
      .executeTakeFirst();
  }

  public async getPlaceDetailsByPlaceId(placeId: number) {
    return await this.db
      .selectFrom('placeDetails')
      .selectAll()
      .where('placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async createPlaceDetails(place: Insertable<PlaceDetails>) {
    await this.db.insertInto('placeDetails').values(place).executeTakeFirst();
  }

  public async updatePlaceDetailsById(
    id: number,
    place: Updateable<PlaceDetails>,
  ) {
    await this.db
      .updateTable('placeDetails')
      .set(place)
      .where('id', '=', id)
      .executeTakeFirst();
  }
}
