import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Photos, PhotosVariants } from 'src/types/db/db';
import { PhotoSize } from '../types/photos/photos.dto';

@Injectable()
export class PhotosRepositoryService {
  constructor(private readonly db: DbService) {}

  public async getAvailablePhotosNumber(placeId) {
    return await this.db.db
      .selectFrom('photos')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('photos.placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async createPhoto(dataPhoto: Insertable<Photos>) {
    return await this.db.db
      .insertInto('photos')
      .values(dataPhoto)
      .returning('photos.id')
      .executeTakeFirst();
  }
  public async createPhotoVariant(
    dataPhotoVariant: Insertable<PhotosVariants>[],
  ) {
    await this.db.db
      .insertInto('photosVariants')
      .values(dataPhotoVariant)
      .execute();
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
      .where('photos.placeId', '=', placeId)
      .where('photosVariants.variant', '=', photoSize)
      .selectAll()
      .orderBy('photos.main', (m) => m.desc().nullsLast())
      .orderBy('photos.id', 'asc')
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
      .execute();
  }
  public async getPhotoById(photoId: number, photoSize: PhotoSize) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('photos.id', '=', photoId)
      .where('photosVariants.variant', '=', photoSize)
      .executeTakeFirst();
  }
}
