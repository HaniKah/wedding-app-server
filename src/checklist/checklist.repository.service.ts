import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable } from 'kysely';
import { Checklist } from 'src/types/db/db';

@Injectable()
export class ChecklistRepositoryService {
  constructor(private readonly db: DbService) {}

  public async createTask(data: Insertable<Checklist>) {
    return await this.db.db
      .insertInto('checklist')
      .values(data)
      .returning('id')
      .executeTakeFirst();
  }

  public async deleteTask(id: number) {
    await this.db.db
      .deleteFrom('checklist')
      .where('id', '=', id)
      .executeTakeFirst();
  }

  public async getAllTasks(userId: number) {
    return await this.db.db
      .selectFrom('checklist')
      .selectAll()
      .where('userId', '=', userId)
      .execute();
  }
}
