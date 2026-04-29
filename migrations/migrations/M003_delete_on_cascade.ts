import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('planner.guests')
    .dropConstraint('guests_user_id_fkey')
    .execute();

  await db.schema
    .alterTable('planner.guests')
    .addForeignKeyConstraint(
      'guests_user_id_fkey',
      ['user_id'],
      'planner.users',
      ['id'],
    )
    .onDelete('cascade')
    .execute();

  await db.schema
    .alterTable('planner.places')
    .dropConstraint('places_user_id_fkey')
    .execute();

  await db.schema
    .alterTable('planner.places')
    .addForeignKeyConstraint(
      'places_user_id_fkey',
      ['user_id'],
      'planner.users',
      ['id'],
    )
    .onDelete('cascade')
    .execute();

  await db.schema
    .alterTable('planner.plans')
    .dropConstraint('plans_user_id_fkey')
    .execute();

  await db.schema
    .alterTable('planner.plans')
    .addForeignKeyConstraint(
      'plans_user_id_fkey',
      ['user_id'],
      'planner.users',
      ['id'],
    )
    .onDelete('cascade')
    .execute();

  await db.schema
    .alterTable('planner.place_filter')
    .dropConstraint('place_filter_user_id_fkey')
    .execute();

  await db.schema
    .alterTable('planner.place_filter')
    .addForeignKeyConstraint(
      'place_filter_user_id_fkey',
      ['user_id'],
      'planner.users',
      ['id'],
    )
    .onDelete('cascade')
    .execute();

  await db.schema
    .alterTable('planner.checklist')
    .dropConstraint('checklist_user_id_fkey')
    .execute();

  await db.schema
    .alterTable('planner.checklist')
    .addForeignKeyConstraint(
      'checklist_user_id_fkey',
      ['user_id'],
      'planner.users',
      ['id'],
    )
    .onDelete('cascade')
    .execute();
}
