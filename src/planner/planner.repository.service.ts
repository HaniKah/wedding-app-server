import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Kysely, Selectable } from 'kysely';
import { DB, PlansDetails } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlannerRepositoryService {
  private readonly db: Kysely<DB>;
  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
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
  ): Promise<Selectable<PlansDetails>[]> {
    return await this.db
      .selectFrom('plansDetails')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }

  public async getCompletedSteps() {
    return await this.db
      .selectFrom('plansDetails')
      .selectAll()
      .where('picked', '=', true)
      .execute();
  }
  public async getPlaceDetailsOfCompletedStep(step: WeddingSteps) {
    return await this.db
      .selectFrom('plansDetails')
      .selectAll()
      .where('step', '=', step)
      .where('picked', '=', true)
      .executeTakeFirst();
  }
  public async getPlaceDetailsByPlaceId(placeId: number) {
    return await this.db
      .selectFrom('plansDetails')
      .selectAll()
      .where('placeId', '=', placeId)
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
