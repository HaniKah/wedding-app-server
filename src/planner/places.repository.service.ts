import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlacesRepositoryService {
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
}
