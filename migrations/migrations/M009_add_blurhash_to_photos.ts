import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('planner.photos')
    .addColumn('blurhash', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('planner.photos').dropColumn('blurhash').execute();
}
