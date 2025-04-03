/*
  Warnings:

  - You are about to drop the column `stageId` on the `TimeBilled` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TimeBilled" DROP CONSTRAINT "TimeBilled_stageId_fkey";

-- AlterTable
ALTER TABLE "TimeBilled" DROP COLUMN "stageId";
