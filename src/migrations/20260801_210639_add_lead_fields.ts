import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_interest" AS ENUM('heat', 'solar', 'climate', 'wholesale', 'other');
  ALTER TABLE "leads" ADD COLUMN "interest" "enum_leads_interest";
  ALTER TABLE "leads" ADD COLUMN "product" varchar;
  ALTER TABLE "leads" ADD COLUMN "source_page" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads" DROP COLUMN "interest";
  ALTER TABLE "leads" DROP COLUMN "product";
  ALTER TABLE "leads" DROP COLUMN "source_page";
  DROP TYPE "public"."enum_leads_interest";`)
}
