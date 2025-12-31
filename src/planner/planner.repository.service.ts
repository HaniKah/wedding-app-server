import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Kysely } from 'kysely';
import { DB } from 'src/types/db/db';
import { DbService } from '../db/db.service';
import { SearchFilter } from '../types/planner/places.dto';

@Injectable()
export class PlannerRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }

  public async getAllPlaces(
    userId: number,
    step: WeddingSteps,
    searchQuery?: string,
    filter?: SearchFilter,
    offset?: number,
  ) {
    const LIMIT = 5;

    const planRecord = await this.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.userId', '=', userId)
      .executeTakeFirst();

    if (!planRecord) return [];

    const placeFilter = this.db
      .selectFrom('placeFilter')
      .select(['placeId', 'picked', 'favourite'])
      .where('placeFilter.planId', '=', planRecord.id)
      .as('placeFilter');

    return await this.db
      .selectFrom('places')
      .selectAll()
      .leftJoin(placeFilter, 'placeFilter.placeId', 'places.id')
      .select([
        'placeFilter.picked as picked',
        'placeFilter.favourite as favourite',
      ])
      .where('isPublished', '=', true)
      .where('step', '=', step)
      .where('places.deletedAt', 'is', null)
      .$if(!!searchQuery, (eb) =>
        eb.where((eb) => eb.or([eb('name', 'ilike', `%${searchQuery}%`)])),
      )
      .$if(filter == SearchFilter.MyFavourite, (qb) =>
        qb.where('favourite', '=', true),
      )
      .$if(filter === SearchFilter.MyPick, (qbb) =>
        qbb.where('picked', '=', true),
      )
      .limit(LIMIT)
      .offset(LIMIT * offset)

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
