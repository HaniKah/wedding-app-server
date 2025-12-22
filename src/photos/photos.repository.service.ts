import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Photos } from 'src/types/db/db';
import { PhotoSize } from '../types/photos/photos.dto';

@Injectable()
export class PhotosRepositoryService {
  constructor(private readonly db: DbService) {}

  public async createPhoto(data: Insertable<Photos>) {
    await this.db.db.insertInto('photos').values(data).execute();
  }
  public async getPhotosByPlaceId(placeId: number, photoSize: PhotoSize) {
    return await this.db.db
      .selectFrom('photos')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('size', '=', photoSize)
      .execute();
  }
  public async getMainPhoto(placeId: number, photoSize: PhotoSize) {
    return this.db.db
      .selectFrom('photos')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('size', '=', photoSize)
      .where('main', 'is', true)
      .executeTakeFirst();
  }
}
