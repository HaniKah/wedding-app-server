import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CountryCode } from '../types/general/countries.dto';
import { Categories } from '../types/general/categories';

@Injectable()
export class PlannerRepositoryService {
  constructor(private readonly dbService: DbService) {}

  public async getAllPlaces(
    countryCode: CountryCode,
    offset: number,
    searchQuery?: string,
    category?: Categories,
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
      .$if(!!category, (eb) => eb.where('places.step', '=', category))
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
