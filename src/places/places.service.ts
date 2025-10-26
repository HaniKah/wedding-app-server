import { Injectable } from '@nestjs/common';
import { Insertable } from 'kysely';
import { Places } from 'kysely-codegen';
import { DbService } from '../db/db.service';

@Injectable()
export class PlacesService {
  constructor(private readonly db: DbService) {}
  public async createPlace(data: Insertable<Places>) {
    await this.db.db.insertInto('places').values(data).executeTakeFirst();
  }
}
