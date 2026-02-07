import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema('planner').dropTable('promotions').execute();

  await db.schema
    .withSchema('planner')
    .createTable('promotions')
    .addColumn('id', 'serial', (table) => table.primaryKey())
    .addColumn('place_id', 'integer', (table) =>
      table.references('places.id').notNull(),
    )
    .addColumn('purchased_at', 'timestamptz', (t) => t.notNull())
    .addColumn('product_id', 'varchar')
    .addColumn('price_in_purchased_currency', `numeric(${12}, ${2})`)
    .addColumn('price', `numeric(${12}, ${2})`)
    .execute();

  await db.schema
    .withSchema('planner')
    .alterTable('places')
    .addColumn('promotion_begins_at', 'timestamptz')
    .addColumn('promotion_ends_at', 'timestamptz')
    .addColumn('sale_label', 'varchar')
    .addColumn('sale_percentage', `numeric(${3}, ${2})`)
    .execute();

  await db.schema
    .withSchema('planner')
    .createIndex('idx_places_promotion_duration')
    .on('places')
    .column('promotion_begins_at')
    .column('promotion_ends_at')
    .execute();

  await db.schema
    .withSchema('planner')
    .alterTable('users')
    .addColumn('rc_app_user_id', 'varchar')
    .addColumn('rc_original_app_user_id', 'varchar')
    .addColumn('rc_aliases', 'varchar')
    .execute();
}
