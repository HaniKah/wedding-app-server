import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('planner.users')
    .addColumn('apple_id', 'varchar')
    .execute();
}
