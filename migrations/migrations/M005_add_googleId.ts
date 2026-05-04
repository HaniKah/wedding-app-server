import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('planner.users')
    .addColumn('google_id', 'varchar')
    .execute();
}
