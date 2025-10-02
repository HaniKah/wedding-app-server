import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable, Kysely, Updateable } from 'kysely';
import { DB, Guests } from 'kysely-codegen';

@Injectable()
export class GuestsRepositoryService {
  private readonly db: Kysely<DB>;
  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }
  public async getAllGuests(userId: number) {
    return await this.db
      .selectFrom('guests')
      .selectAll()
      .where('userId', '=', userId)
      .execute();
  }

  public async createGuest(guest: Insertable<Guests>) {
    await this.db.insertInto('guests').values(guest).executeTakeFirst();
  }

  public async updateGuest(userId: number, guest: Updateable<Guests>) {
    await this.db
      .updateTable('guests')
      .where('userId', '=', userId)
      .set(guest)
      .executeTakeFirst();
  }
}
