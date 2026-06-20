import { Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { DbService } from '../db/db.service';
import { DB } from 'src/types/db/db';

@Injectable()
export class EmailOtpRepositoryService {
  private readonly db: Kysely<DB>;

  constructor(private readonly dbService: DbService) {
    this.db = dbService.db;
  }

  /**
   * Invalidates any previous unconsumed codes for the user, then stores the new one.
   */
  public async createOtp(
    userId: number,
    codeHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.db
      .updateTable('emailOtps')
      .set({ consumedAt: sql`now()` })
      .where('userId', '=', userId)
      .where('consumedAt', 'is', null)
      .execute();

    await this.db
      .insertInto('emailOtps')
      .values({ userId, codeHash, expiresAt })
      .executeTakeFirstOrThrow();
  }

  /** Latest unconsumed, unexpired code for the user. */
  public async findActiveOtp(userId: number) {
    return this.db
      .selectFrom('emailOtps')
      .selectAll()
      .where('userId', '=', userId)
      .where('consumedAt', 'is', null)
      .where('expiresAt', '>', sql<Date>`now()`)
      .orderBy('createdAt', 'desc')
      .executeTakeFirst();
  }

  public async incrementAttempts(otpId: number): Promise<void> {
    await this.db
      .updateTable('emailOtps')
      .set((eb) => ({ attempts: eb('attempts', '+', 1) }))
      .where('id', '=', otpId)
      .execute();
  }

  public async consumeOtp(otpId: number): Promise<void> {
    await this.db
      .updateTable('emailOtps')
      .set({ consumedAt: sql`now()` })
      .where('id', '=', otpId)
      .execute();
  }

  /** Timestamp of the most recent code created for the user (for resend cooldown). */
  public async getLastCreatedAt(userId: number): Promise<Date | undefined> {
    const row = await this.db
      .selectFrom('emailOtps')
      .select('createdAt')
      .where('userId', '=', userId)
      .orderBy('createdAt', 'desc')
      .executeTakeFirst();
    return row?.createdAt;
  }
}
