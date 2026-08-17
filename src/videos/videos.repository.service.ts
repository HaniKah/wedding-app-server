import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Videos } from 'src/types/db/db';

@Injectable()
export class VideosRepositoryService {
  constructor(private readonly db: DbService) {}

  public async setMainVideo(placeId: number, videoId: number) {
    await this.db.db
      .updateTable('videos')
      .set({ main: false })
      .where('placeId', '=', placeId)
      .where('main', 'is', true)
      .execute();

    await this.db.db
      .updateTable('videos')
      .set({ main: true })
      .where('id', '=', videoId)
      .where('placeId', '=', placeId)
      .executeTakeFirst();
  }

  public async createVideo(dataVideo: Insertable<Videos>) {
    return await this.db.db
      .insertInto('videos')
      .values(dataVideo)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  public async getVideosByPlaceId(placeId: number) {
    return await this.db.db
      .selectFrom('videos')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('deletedAt', 'is', null)
      .orderBy('main', (m) => m.desc().nullsLast())
      .orderBy('id', 'desc')
      .execute();
  }

  public async getMainVideo(placeId: number) {
    return await this.db.db
      .selectFrom('videos')
      .selectAll()
      .where('placeId', '=', placeId)
      .where('deletedAt', 'is', null)
      .orderBy('main', (m) => m.desc().nullsLast())
      .orderBy('id', 'desc')
      .executeTakeFirst();
  }

  public async getVideoById(videoId: number) {
    return await this.db.db
      .selectFrom('videos')
      .selectAll()
      .where('id', '=', videoId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  public async deleteVideo(videoId: number) {
    await this.db.db
      .deleteFrom('videos')
      .where('id', '=', videoId)
      .executeTakeFirst();
  }
}
