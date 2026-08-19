import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable, Updateable } from 'kysely';
import { Users } from 'src/types/db/db';
import { Role } from '../types/auth/auth.dto';
import { PlansRepositoryService } from '../planner/plans.repository.service';
import { PhotosService } from '../photos/photos.service';
import { VideosService } from '../videos/videos.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly dbService: DbService,
    private readonly plansRepositoryService: PlansRepositoryService,
    private readonly photosService: PhotosService,
    private readonly videosService: VideosService,
  ) {}

  async updateUser(userId: number, data: Updateable<Users>) {
    return await this.dbService.db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', userId)
      .executeTakeFirstOrThrow();
  }

  async findUserByAppleId(appleId: string) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('appleId', '=', appleId)
      .executeTakeFirst();
  }
  async findUserByGoogleId(googleId: string) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('googleId', '=', googleId)
      .executeTakeFirst();
  }

  async updateRoleById(id: number, role: Role) {
    return await this.dbService.db
      .updateTable('users')
      .set('role', role)
      .where('users.id', '=', id)
      .executeTakeFirst();
  }

  async findUserByEmail(email: string) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .where('googleId', 'is', null)
      .where('appleId', 'is', null)
      .executeTakeFirst();
  }

  async findUserById(id: number) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async findAllUsers() {
    return await this.dbService.db
      .selectFrom('users')
      .select([
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'googleId',
        'appleId',
        'emailVerified',
        'createdAt',
      ])
      .orderBy('id', 'desc')
      .execute();
  }

  async findAdminUserById(id: number) {
    return await this.dbService.db
      .selectFrom('users')
      .select([
        'id',
        'firstName',
        'lastName',
        'email',
        'role',
        'googleId',
        'appleId',
        'emailVerified',
        'createdAt',
      ])
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createUser(user: Insertable<Users>) {
    const userId = await this.dbService.db
      .insertInto('users')
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
    await this.plansRepositoryService.createPlan(userId.id);
    return userId;
  }

  async updateHashedRefreshToken(
    userId: number,
    hashedRefreshToken: string | null,
  ) {
    return await this.dbService.db
      .updateTable('users')
      .set('refreshToken', hashedRefreshToken)
      .where('users.id', '=', userId)
      .executeTakeFirst();
  }
  async deleteUser(userId: number) {
    const [photoIds, videoIds] = await Promise.all([
      this.getAllObjectKeysByUserId(userId),
      this.getAllVideoIdsByUserId(userId),
    ]);
    await Promise.all([
      ...photoIds.map((p) => this.photosService.deletePhoto(p.id)),
      ...videoIds.map((v) => this.videosService.deleteVideo(v.id)),
    ]);

    await this.dbService.db
      .deleteFrom('users')
      .where('id', '=', userId)
      .executeTakeFirst();
  }
  private async getAllObjectKeysByUserId(userId: number) {
    return await this.dbService.db
      .selectFrom('places')
      .innerJoin('photos', 'places.id', 'photos.placeId')
      .select('photos.id')
      .where('userId', '=', userId)
      .execute();
  }
  private async getAllVideoIdsByUserId(userId: number) {
    return await this.dbService.db
      .selectFrom('places')
      .innerJoin('videos', 'places.id', 'videos.placeId')
      .select('videos.id')
      .where('userId', '=', userId)
      .execute();
  }
}
