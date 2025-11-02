import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Photos } from 'kysely-codegen';

@Injectable()
export class PhotosRepositoryService {
  constructor(private readonly db: DbService) {}

  public async createPhoto(data: Insertable<Photos>) {
    await this.db.db.insertInto('photos').values(data).execute();
  }
  public async getPhotosByPlaceId(placeId: number) {
    return await this.db.db
      .selectFrom('photos')
      .selectAll()
      .where('placeId', '=', placeId)
      .execute();
  }
}
