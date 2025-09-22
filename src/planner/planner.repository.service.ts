import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, PlaceDetails } from 'kysely-codegen';
import { DbService } from '../db/db.service';
import { PlaceDetailsRequest } from '../types/planner/places.dto';

@Injectable()
export class PlannerRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }

  public async updateWeddingDate(planId: number, date: Date) {
    await this.db
      .updateTable('plans')
      .set('weddingDate', date)
      .where('id', '=', planId)
      .executeTakeFirstOrThrow();
  }

  public async getPlanByIdOrThrow(planId: number) {
    return this.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.id', '=', planId)
      .executeTakeFirstOrThrow(); // every user should have a plan
  }

  public async removeAllPicked(planId: number, step: WeddingSteps) {
    await this.db
      .updateTable('placeDetails')
      .set('picked', false)
      .where('step', '=', step)
      .where('planId', '=', planId)
      .execute();
  }

  public async updatePlaceDetails(
    planId: number,
    request: PlaceDetailsRequest,
  ) {
    //because we dont delete , here we might have records that has no picked, no fav , no notes !
    if (request.picked) {
      await this.removeAllPicked(planId, request.step);
    }
    const details = await this.getPlaceDetailsByPlaceId(request.placeId);

    if (details) {
      //todo optimization: here we are updating unnecessary fields
      await this.updatePlaceDetailsById(details.id, {
        step: request.step,
        picked: request.picked,
        cost: request.cost,
        notes: request.notes,
      });
    } else {
      //todo optimization: here we are updating unnecessary fields
      await this.createPlaceDetails({
        planId: planId,
        placeId: request.placeId,
        step: request.step,
        picked: request.picked,
        favourite: request.favorite,
        cost: request.cost,
      });
    }
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
}
