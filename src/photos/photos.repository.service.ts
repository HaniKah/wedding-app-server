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
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('photosVariants.variant', '=', photoSize)
      .execute();
  }
  public async getMainPhoto(placeId: number, photoSize: PhotoSize) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('main', 'is', true)
      .where('photosVariants.variant', '=', photoSize)
      .executeTakeFirst();
  }
  public async photoExists(placeId: number) {
    const photos = await this.db.db
      .selectFrom('photos')
      .selectAll()
      .where('placeId', '=', placeId)
      .execute();
    return photos.length > 0;
  }
  public async deletePhoto(photoId: number) {
    await this.db.db
      .deleteFrom('photos')
      .where('id', '=', photoId)
      .executeTakeFirst();
  }
  public async getPhotosById(photoId: number) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('photos.id', '=', photoId)
      .executeTakeFirst();
  }
}
