import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('planner.users')
    .alterColumn('first_name', (cb) => cb.dropNotNull())
    .alterColumn('last_name', (cb) => cb.dropNotNull())
    .execute();
}
