import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .withSchema('planner')
    .alterTable('places')
    .dropColumn('currency')
    .execute();
}
