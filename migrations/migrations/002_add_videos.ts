import { Kysely, sql } from 'kysely';

// The migrator runs with CamelCasePlugin (see migrations/migrate.ts), so we
// write camelCase identifiers here and they map to snake_case columns in the DB.
// WithSchemaPlugin is NOT applied by the migrator, so we set the schema explicitly.
const SCHEMA = 'planner';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .withSchema(SCHEMA)
    .createTable('videos')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('placeId', 'integer', (col) =>
      col.notNull().references(`${SCHEMA}.places.id`),
    )
    .addColumn('bucketName', 'varchar', (col) => col.notNull())
    .addColumn('mimeType', 'varchar', (col) => col.notNull())
    .addColumn('fileSize', 'integer', (col) => col.notNull())
    .addColumn('durationMs', 'integer')
    .addColumn('objectKey', 'varchar', (col) => col.notNull())
    .addColumn('posterObjectKey', 'varchar')
    .addColumn('ratio', 'double precision')
    .addColumn('blurhash', 'varchar')
    .addColumn('main', 'boolean')
    .addColumn('deletedAt', sql`timestamptz`)
    .addColumn('createdAt', sql`timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .withSchema(SCHEMA)
    .createIndex('videosPlaceIdIdx')
    .on('videos')
    .column('placeId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema(SCHEMA).dropTable('videos').execute();
}
