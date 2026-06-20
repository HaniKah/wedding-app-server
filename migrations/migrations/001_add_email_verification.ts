import { Kysely, sql } from 'kysely';

// The migrator runs with CamelCasePlugin (see migrations/migrate.ts), so we
// write camelCase identifiers here and they map to snake_case columns in the DB.
// WithSchemaPlugin is NOT applied by the migrator, so we set the schema explicitly.
const SCHEMA = 'planner';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Add emailVerified flag to users.
  await db.schema
    .withSchema(SCHEMA)
    .alterTable('users')
    .addColumn('emailVerified', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .execute();

  // Existing accounts (incl. Google/Apple users) are already trusted — mark them
  // verified so this change doesn't lock anyone out.
  await db
    .withSchema(SCHEMA)
    .updateTable('users')
    .set({ emailVerified: true })
    .execute();

  // 2. OTP codes table. Codes are stored hashed (argon2), never in plaintext.
  await db.schema
    .withSchema(SCHEMA)
    .createTable('emailOtps')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('userId', 'integer', (col) =>
      col
        .notNull()
        .references(`${SCHEMA}.users.id`)
        .onDelete('cascade'),
    )
    .addColumn('codeHash', 'varchar', (col) => col.notNull())
    .addColumn('expiresAt', sql`timestamptz`, (col) => col.notNull())
    .addColumn('attempts', 'integer', (col) => col.notNull().defaultTo(0))
    .addColumn('consumedAt', sql`timestamptz`)
    .addColumn('createdAt', sql`timestamptz`, (col) =>
      col.notNull().defaultTo(sql`now()`),
    )
    .execute();

  await db.schema
    .withSchema(SCHEMA)
    .createIndex('emailOtpsUserIdIdx')
    .on('emailOtps')
    .column('userId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.withSchema(SCHEMA).dropTable('emailOtps').execute();
  await db.schema
    .withSchema(SCHEMA)
    .alterTable('users')
    .dropColumn('emailVerified')
    .execute();
}
