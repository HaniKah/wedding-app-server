import { Injectable, NotFoundException } from '@nestjs/common';
import { WeddingSteps } from '../types/general/wedding-steps-enum.dto';
import { DbService } from '../db/db.service';
import { SearchFilter } from '../types/planner/places.dto';
import { CountryCode } from '../types/general/countries.dto';

@Injectable()
export class PlannerRepositoryService {
  constructor(private readonly dbService: DbService) {}

  public async getAllPlaces(
    userId: number,
    step: WeddingSteps,
    countryCode: CountryCode,
    offset: number,
    searchQuery?: string,
    filter?: SearchFilter,
  ) {
    const LIMIT = 5;
    const now = new Date();

    const planRecord = await this.dbService.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.userId', '=', userId)
      .executeTakeFirst();

    if (!planRecord) return [];

    const placeFilter = this.dbService.db
      .selectFrom('placeFilter')
      .select(['placeId', 'isPicked', 'isFavorite'])
      .where('placeFilter.userId', '=', userId)
      .as('placeFilter');

    return await this.dbService.db
      .selectFrom('places')
      .selectAll()
      .leftJoin(placeFilter, 'placeFilter.placeId', 'places.id')
      .select([
        'placeFilter.isPicked as picked',
        'placeFilter.isFavorite as favourite',
      ])
      .where('isPublished', '=', true)
      .where('step', '=', step)
      .where('places.deletedAt', 'is', null)
      // .where('places.country', '=', countryCode) lets not do that yet ( restrictions are on AppStore only )
      .$if(!!searchQuery, (eb) =>
        eb.where((eb) => eb.or([eb('name', 'ilike', `%${searchQuery}%`)])),
      )
      .$if(filter == SearchFilter.MyFavourite, (qb) =>
        qb.where('isFavorite', '=', true),
      )
      .$if(filter === SearchFilter.MyPick, (qbb) =>
        qbb.where('isPicked', '=', true),
      )
      .orderBy((eb) =>
        eb
          .case()
          .when(
            eb.and([
              eb('places.promotionBeginsAt', '<=', now),
              eb('places.promotionEndsAt', '>=', now),
            ]),
          )
          .then(0)
          .else(1)
          .end(),
      )
      .orderBy('places.promotionBeginsAt', 'desc')
      .orderBy('places.createdAt', 'desc')
      .limit(LIMIT)
      .offset(LIMIT * offset)
      .execute();
  }

  public async getPlaceByIdOrThrow(placeId: number) {
    return await this.dbService.db
      .selectFrom('places')
      .selectAll()
      .where('id', '=', placeId)
      .executeTakeFirstOrThrow(
        () =>
          new NotFoundException(`place with place Id : ${placeId} not found`),
      );
  }
}
