import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .withSchema('planner')
    .alterTable('photos')
    .addColumn('ratio', 'double precision')
    .execute();
}
