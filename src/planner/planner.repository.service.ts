import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Insertable, Kysely, Selectable, Updateable } from 'kysely';
import { DB, PlaceDetails } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlannerRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }

  public async placeDetailsExists(
    planId: number,
    step: WeddingSteps,
  ): Promise<boolean> {
    const res = await this.db
      .selectFrom('placeDetails')
      .select('placeId')
      .where('planId', '=', planId)
      .where('step', '=', step)
      .execute();
    return res && res.length > 0;
  }

  public async removeAllPicked(step: WeddingSteps, planId: number) {
    await this.db
      .updateTable('placeDetails')
      .set('picked', false)
      .where('step', '=', step)
      .where('planId', '=', planId)
      .execute();
  }

  public async pickPlace(placeId: number, step: WeddingSteps, planId: number) {
    //because we dont delete , here we might have records that has no picked, no fav , no notes !
    await this.removeAllPicked(step, planId);
    const details = await this.getPlaceDetailsByPlaceId(placeId);
    if (details) {
      await this.updatePlaceDetailsById(details.id, { picked: true });
    } else {
      await this.createPlaceDetails({
        placeId: placeId,
        step: WeddingSteps,
        planId: planId,
      });
    }
  }

  public async updateFavourite(placeId: number) {
    await this.db
      .updateTable('placeDetails')
      .set('favourite', true)
      .where('placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async getAllPlaces(step: WeddingSteps) {
    return await this.db
      .selectFrom('places')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }

  public async getPlaceByIdOrThrow(placeId: number) {
    return await this.db
      .selectFrom('places')
      .selectAll()
      .where('id', '=', placeId)
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(`place with place Id : ${placeId} not found`),
      );
  }

  public async getDetailsByStep(
    step: WeddingSteps,
    planId: number,
  ): Promise<Selectable<PlaceDetails>[]> {
    return await this.db
      .selectFrom('placeDetails')
      .selectAll()
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

  private async createPlaceDetails(place: Insertable<PlaceDetails>) {
    await this.db.insertInto('placeDetails').values(place).executeTakeFirst();
  }

  private async updatePlaceDetailsById(
    id: number,
    place: Updateable<PlaceDetails>,
  ) {
    await this.db
      .updateTable('placeDetails')
      .set(place)
      .where('id', '=', id)
      .executeTakeFirst();
  }

  // public async getPlanByUserId(userId): Promise<Selectable<Plans>[]> {
  //   return await db
  //     .selectFrom('plans')
  //     .selectAll()
  //     .where('userId', '=', userId)
  //     .executeTakeFirst();
  // }
}
