import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import * as pg from 'pg';
import { DB } from 'kysely-codegen';

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL as string,
    }),
  }),
  plugins: [new CamelCasePlugin()],
});
