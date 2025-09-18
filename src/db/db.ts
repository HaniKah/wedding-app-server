import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  WithSchemaPlugin,
} from 'kysely';
import * as pg from 'pg';
import { DB } from 'kysely-codegen';
import { ConfigService } from '@nestjs/config';

// const NUMERIC_OID = 1700;
// pg.types.setTypeParser(NUMERIC_OID, (val) => parseFloat(val));

// const BIGINT_OID = 20;
// pg.types.setTypeParser(BIGINT_OID, (val) => parseInt(val, 10));

const config = new ConfigService();
const db_url = config.get<string>('DATABASE_URL');
console.log(db_url);
export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({
      connectionString: db_url,
    }),
  }),
  plugins: [new CamelCasePlugin(), new WithSchemaPlugin('planner')],
});
