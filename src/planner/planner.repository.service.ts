import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CountryCode } from '../types/general/countries.dto';
import { SearchFilter } from '../types/planner/places.dto';
import { Money } from '../common/Money';

@Injectable()
export class PlannerRepositoryService {
  constructor(private readonly dbService: DbService) {}

  public async getAllPlaces(
    countryCode: CountryCode,
    offset: number,
    searchQuery?: string,
    filters?: SearchFilter,
  ) {
    const LIMIT = 5;
    const now = new Date();

    return await this.dbService.db
      .selectFrom('places')
      .selectAll()
      .where('isPublished', '=', true)
      .where('places.deletedAt', 'is', null)
      .where('places.country', '=', countryCode)
      .$if(!!searchQuery, (eb) =>
        eb.where((eb) => eb.or([eb('name', 'ilike', `%${searchQuery}%`)])),
      )
      .$if(filters?.category !== undefined, (eb) =>
        eb.where('places.step', '==', filters.category),
      )
      .$if(filters?.price !== undefined, (eb) =>
        eb.where('places.minPrice', '>=', new Money(filters.price)),
      )
      .$if(filters?.city !== undefined, (eb) =>
        eb.where('places.city', '==', filters.city),
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
