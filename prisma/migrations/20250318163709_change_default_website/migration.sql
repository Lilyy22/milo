/*
  Warnings:

  - Made the column `domain` on table `Website` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Website` required. This step will fail if there are existing NULL values in that column.
  - Made the column `googleAnalyticsId` on table `Website` required. This step will fail if there are existing NULL values in that column.
  - Made the column `searchConsoleId` on table `Website` required. This step will fail if there are existing NULL values in that column.
  - Made the column `githubRepositoryUrl` on table `Website` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastBuildAt` on table `Website` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Website" ALTER COLUMN "domain" SET NOT NULL,
ALTER COLUMN "domain" SET DEFAULT '',
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "googleAnalyticsId" SET NOT NULL,
ALTER COLUMN "googleAnalyticsId" SET DEFAULT '',
ALTER COLUMN "searchConsoleId" SET NOT NULL,
ALTER COLUMN "searchConsoleId" SET DEFAULT '',
ALTER COLUMN "githubRepositoryUrl" SET NOT NULL,
ALTER COLUMN "githubRepositoryUrl" SET DEFAULT '',
ALTER COLUMN "lastBuildAt" SET NOT NULL;
