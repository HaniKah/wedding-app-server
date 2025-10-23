import { Injectable } from '@nestjs/common';

import { Kysely, Updateable } from 'kysely';
import { DB, Plans } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlansRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }
  public async createPlan(userId: number) {
    await this.db
      .insertInto('plans')
      .values({ userId: userId })
      .executeTakeFirstOrThrow();
  }

  public async updatePlan(id: number, plan: Updateable<Plans>): Promise<void> {
    await this.db
      .updateTable('plans')
      .set(plan)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  public async getPlanByIdOrThrow(planId: number) {
    return this.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.id', '=', planId)
      .executeTakeFirstOrThrow(); // every user should have a plan
  }
  public async getPlanByUserIdOrThrow(userId: number) {
    return this.db
      .selectFrom('plans')
      .selectAll()
      .where('plans.userId', '=', userId)
      .executeTakeFirstOrThrow();
  }
}
