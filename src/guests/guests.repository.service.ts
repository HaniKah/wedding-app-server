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
      .where('deletedAt', 'is', null)
      .execute();
  }

  public async createGuest(guest: Insertable<Guests>) {
    await this.db.insertInto('guests').values(guest).executeTakeFirst();
  }

  public async updateGuest(userId: number, guest: Updateable<Guests>) {
    await this.db
      .updateTable('guests')
      .set(guest)
      .where('userId', '=', userId)
      .where('id', '=', guest.id)
      .executeTakeFirst();
  }

  public async deleteGuest(id: number) {
    await this.db
      .updateTable('guests')
      .set('deletedAt', new Date(Date.now()))
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }
}
