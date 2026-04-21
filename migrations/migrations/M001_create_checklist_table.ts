import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('planner.checklist')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('planner.users.id').onDelete('cascade').notNull(),
    )
    .addColumn('task', 'varchar', (col) => col.notNull())
    .addColumn('isChecked', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('timeframe', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo(sql`now()`),
    )

    .execute();
}
