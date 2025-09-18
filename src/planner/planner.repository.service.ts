import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { db } from '../db/db';
import { Selectable } from 'kysely';
import { PlansDetails } from 'kysely-codegen';

@Injectable()
export class PlannerRepositoryService {
  public async getAllPlaces(step: WeddingSteps) {
    return await db
      .selectFrom('places')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }

  public async getPlaceByIdOrThrow(placeId: number) {
    return await db
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
    return await db
      .selectFrom('plansDetails')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }

  public async getCompletedSteps(): Promise<Selectable<PlansDetails>[]> {
    return await db
      .selectFrom('plansDetails')
      .selectAll()
      .where('picked', '=', true)
      .execute();
  }
  public async getDetailsForCompletedStep(
    step: WeddingSteps,
  ): Promise<Selectable<PlansDetails> | undefined> {
    return await db
      .selectFrom('plansDetails')
      .selectAll()
      .where('step', '=', step)
      .where('picked', '=', true)
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
