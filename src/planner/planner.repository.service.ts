import { Injectable } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { db } from '../db/db';

@Injectable()
export class PlannerRepositoryService {
  public async getAllPlaces(step: WeddingSteps) {
    return await db
      .selectFrom('places')
      .selectAll()
      .where('step', '=', step)
      .execute();
  }
}
