import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CountryCode } from '../types/general/countries.dto';
import { SearchFilter } from '../types/planner/places.dto';

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
      .selectAll('places')
      .select((eb) =>
        eb
          .case()
          .when(
            eb.exists(
              eb
                .selectFrom('photos')
                .select('photos.id')
                .whereRef('photos.placeId', '=', 'places.id'),
            ),
          )
          .then(1)
          .else(0)
          .end()
          .as('hasPhotos'),
      )
      .select((eb) =>
        eb
          .case()
          .when(
            eb.and([
              eb('places.promotionBeginsAt', '<=', now),
              eb('places.promotionEndsAt', '>=', now),
            ]),
          )
          .then(1)
          .else(0)
          .end()
          .as('isPromoted'),
      )
      .where('isPublished', '=', true)
      .where('places.deletedAt', 'is', null)
      .where('places.country', '=', countryCode)
      .$if(!!searchQuery, (eb) =>
        eb.where((eb) => eb.or([eb('name', 'ilike', `%${searchQuery}%`)])),
      )
      .$if(filters?.category !== undefined, (eb) =>
        eb.where('places.step', '=', filters.category),
      )
      .$if(filters?.price !== undefined && filters.price !== '0', (eb) =>
        eb.where('places.minPrice', '<=', filters.price),
      )
      .$if(filters?.city !== undefined, (eb) =>
        eb.where('places.city', '=', filters.city),
      )
      .orderBy('places.promotionBeginsAt', 'desc')
      .orderBy('isPromoted', 'desc')
      .orderBy('hasPhotos', 'desc')
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
