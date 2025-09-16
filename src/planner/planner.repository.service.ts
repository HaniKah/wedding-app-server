import { Injectable } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { db } from '../db/db';
import { Selectable } from 'kysely';
import { Places } from 'kysely-codegen';

@Injectable()
export class PlannerRepositoryService {
  public async getAllPlaces(step: WeddingSteps): Promise<Selectable<Places>[]> {
    return await db
      .selectFrom('places')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }
  public async getPlaceById(placeId: number): Promise<Selectable<Places>> {
    const record = await db
      .selectFrom('places')
      .selectAll()
      .where('id', '=', placeId)
      .executeTakeFirst();
    if (!record) throw new Error(`Id doesnt exist , Id number : ${placeId}`);
    return record;
  }
}
