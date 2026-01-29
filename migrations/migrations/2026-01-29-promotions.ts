import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .withSchema('planner')
    .alterTable('promotions')
    .addColumn('transaction_id', 'varchar')
    .addColumn('purchase_id', 'varchar')
    .addColumn('product_id', 'varchar')
    .addColumn('management_url', 'varchar')
    .addColumn('label', 'varchar')
    .addColumn('percentage', 'double precision')
    .addColumn('entitlement', 'varchar')
    .execute();
}
