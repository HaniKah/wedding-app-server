import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Users } from 'kysely-codegen';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async findUserByEmail(email: string) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async findUserById(id: number) {
    return await this.dbService.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async createUser(user: Insertable<Users>) {
    return await this.dbService.db
      .insertInto('users')
      .values(user)
      .returningAll()
      .executeTakeFirstOrThrow();
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
}
