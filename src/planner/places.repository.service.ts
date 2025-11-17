import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';

import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';
import { DbService } from '../db/db.service';
import { SearchFilter } from '../types/planner/places.dto';

@Injectable()
export class PlacesRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }

  public async getAllPlaces(
    userId: number,
    step: WeddingSteps,
    searchQuery?: string,
    filter?: SearchFilter,
  ) {
    const planRecord = await this.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.userId', '=', userId)
      .executeTakeFirst();

    if (!planRecord) return [];

    const placeDetails = this.db
      .selectFrom('placeDetails')
      .select(['placeId', 'picked', 'favourite'])
      .where('placeDetails.planId', '=', planRecord.id)
      .as('placeDetails');

    return await this.db
      .selectFrom('places')
      .selectAll()
      .leftJoin(placeDetails, 'placeDetails.placeId', 'places.id')
      .select([
        'placeDetails.picked as picked',
        'placeDetails.favourite as favourite',
      ])
      .where('published', '=', true)
      .where('step', '=', step)
      .$if(!!searchQuery, (eb) =>
        eb.where((eb) => eb.or([eb('name', 'ilike', `%${searchQuery}%`)])),
      )
      .$if(filter == SearchFilter.MyFavourite, (qb) =>
        qb.where('favourite', '=', true),
      )
      .$if(filter === SearchFilter.MyPick, (qbb) =>
        qbb.where('picked', '=', true),
      )

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
