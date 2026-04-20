import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable, Updateable } from 'kysely';
import { Users } from 'src/types/db/db';
import { Role } from '../types/auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async updateUser(userId: number, data: Updateable<Users>) {
    return await this.dbService.db
      .updateTable('users')
      .set(data)
      .where('users.id', '=', userId)
      .executeTakeFirstOrThrow();
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
      .returning('id')
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
