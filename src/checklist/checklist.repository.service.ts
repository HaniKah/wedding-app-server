import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { Insertable, sql } from 'kysely';
import { Checklist } from '../types/db/db';

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
      .orderBy('checklist.createdAt', 'asc')
      .execute();
  }

  public async toggleTask(taskId: number) {
    await this.db.db
      .updateTable('checklist')
      .set({
        isChecked: sql`NOT "isChecked"`,
      })
      .where('id', '=', taskId)
      .execute();
  }
}
