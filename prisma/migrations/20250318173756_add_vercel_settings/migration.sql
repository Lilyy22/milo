/*
  Warnings:

  - Added the required column `projectName` to the `Website` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Website" ADD COLUMN     "projectName" TEXT NOT NULL,
ADD COLUMN     "vercelDeploymentId" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "vercelProjectId" TEXT NOT NULL DEFAULT '';
