import { Injectable } from '@nestjs/common';

import { DB } from 'kysely-codegen';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import {
  CamelCasePlugin,
  Kysely,
  PostgresDialect,
  WithSchemaPlugin,
} from 'kysely';
import { PriceRangeTransformerPlugin } from '../db-utils/priceRange-transformer-plugin';

@Injectable()
export class DbService {
  public readonly db: Kysely<DB>;

  constructor(private configService: ConfigService) {
    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: this.configService.get<string>('DATABASE_URL'),
        }),
      }),
      plugins: [
        new CamelCasePlugin(),
        new WithSchemaPlugin('planner'),
        new PriceRangeTransformerPlugin(),
      ],
    });
  }
}
