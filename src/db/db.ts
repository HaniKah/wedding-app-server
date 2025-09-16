import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  WithSchemaPlugin,
} from 'kysely';
import * as pg from 'pg';
import { DB } from 'kysely-codegen';

// const NUMERIC_OID = 1700;
// pg.types.setTypeParser(NUMERIC_OID, (val) => parseFloat(val));

// const BIGINT_OID = 20;
// pg.types.setTypeParser(BIGINT_OID, (val) => parseInt(val, 10));

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: process.env.DATABASE_URL as string,
    }),
  }),
  plugins: [new CamelCasePlugin(), new WithSchemaPlugin('planner')],
});
