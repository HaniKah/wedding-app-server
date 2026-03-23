import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('planner').dropTable('place_filter').execute();

  await db.schema
    .withSchema('planner')
    .createTable('place_filter')
    .addColumn('id', 'serial', (table) => table.primaryKey())
    .addColumn('user_id', 'integer', (table) =>
      table.references('users.id').notNull(),
    )
    .addColumn('place_id', 'integer', (table) =>
      table.references('places.id').notNull(),
    )
    .addColumn('isFavorite', 'boolean', (table) => table.defaultTo(false))
    .addColumn('isPicked', 'boolean', (table) => table.defaultTo(false))
    .execute();
}
