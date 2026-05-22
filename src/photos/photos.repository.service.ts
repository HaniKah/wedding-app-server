import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Photos, PhotosVariants } from 'src/types/db/db';
import { PhotoSize } from '../types/photos/photos.dto';

@Injectable()
export class PhotosRepositoryService {
  constructor(private readonly db: DbService) {}

  public async setMainPhoto(placeId: number, photoId: number) {
    await this.db.db
      .updateTable('photos')
      .set({ main: false })
      .where('placeId', '=', placeId)
      .where('main', 'is', true)
      .execute();

    await this.db.db
      .updateTable('photos')
      .set({ main: true })
      .where('id', '=', photoId)
      .where('placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async getAvailablePhotosCount(placeId) {
    return await this.db.db
      .selectFrom('photos')
      .select((eb) => eb.fn.countAll<number>().as('count'))
      .where('photos.placeId', '=', placeId)
      .where('photos.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  public async createPhoto(dataPhoto: Insertable<Photos>) {
    return await this.db.db
      .insertInto('photos')
      .values(dataPhoto)
      .returning('photos.id')
      .executeTakeFirst();
  }
  public async createPhotoVariants(
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
      .where('photos.deletedAt', 'is', null)
      .orderBy('photos.main', (m) => m.desc().nullsLast())
      .orderBy('photos.id', 'desc')
      .execute();
  }
  public async getMainPhoto(placeId: number, photoSize: PhotoSize) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .where('photos.placeId', '=', placeId)
      .where('photos.deletedAt', 'is', null)
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
      .where('photos.deletedAt', '=', null)
      .limit(1)
      .executeTakeFirst();
    return !!photos;
  }
  public async deletePhoto(photoId: number) {
    await this.db.db
      .deleteFrom('photos')
      .where('id', '=', photoId)
      .executeTakeFirst();
  }
  public async getAllVariantsByPhotoId(photoId: number) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('photos.id', '=', photoId)
      .execute();
  }
  public async getVariantByPhotoId(photoId: number, photoSize: PhotoSize) {
    return await this.db.db
      .selectFrom('photos')
      .innerJoin('photosVariants', 'photosVariants.photoId', 'photos.id')
      .selectAll()
      .where('photos.id', '=', photoId)
      .where('photosVariants.variant', '=', photoSize)
      .executeTakeFirst();
  }
}
