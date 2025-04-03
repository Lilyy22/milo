/*
  Warnings:

  - The values [basic,elite] on the enum `TemplateType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `Website` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TemplateType_new" AS ENUM ('BASIC', 'ELITE');
ALTER TABLE "Website" ALTER COLUMN "template" DROP DEFAULT;
ALTER TABLE "Website" ALTER COLUMN "template" TYPE "TemplateType_new" USING ("template"::text::"TemplateType_new");
ALTER TYPE "TemplateType" RENAME TO "TemplateType_old";
ALTER TYPE "TemplateType_new" RENAME TO "TemplateType";
DROP TYPE "TemplateType_old";
ALTER TABLE "Website" ALTER COLUMN "template" SET DEFAULT 'BASIC';
COMMIT;

-- AlterTable
ALTER TABLE "Website" ALTER COLUMN "template" SET DEFAULT 'BASIC';

-- CreateIndex
CREATE UNIQUE INDEX "Website_clientId_key" ON "Website"("clientId");
