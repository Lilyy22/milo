/*
  Warnings:

  - You are about to drop the column `active` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `factFinished` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `planHours` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `plannedDue` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Stage` table. All the data in the column will be lost.
  - You are about to drop the `Invoice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeBilled` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TimeLog` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientDataId` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `docType` to the `Stage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_projectId_fkey";

-- DropForeignKey
ALTER TABLE "StageUsers" DROP CONSTRAINT "StageUsers_stageId_fkey";

-- DropForeignKey
ALTER TABLE "TimeBilled" DROP CONSTRAINT "TimeBilled_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TimeBilled" DROP CONSTRAINT "TimeBilled_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_stageId_fkey";

-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_userId_fkey";

-- AlterTable
ALTER TABLE "Stage" DROP COLUMN "active",
DROP COLUMN "factFinished",
DROP COLUMN "planHours",
DROP COLUMN "plannedDue",
DROP COLUMN "projectId",
ADD COLUMN     "clientDataId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "docType" TEXT NOT NULL,
ADD COLUMN     "docUrl" TEXT,
ADD COLUMN     "pictoryJobId" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "videoErrorMessage" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- DropTable
DROP TABLE "Invoice";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "TimeBilled";

-- DropTable
DROP TABLE "TimeLog";

-- CreateTable
CREATE TABLE "ClientData" (
    "id" SERIAL NOT NULL,
    "clientName" TEXT NOT NULL,
    "qa" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_clientDataId_fkey" FOREIGN KEY ("clientDataId") REFERENCES "ClientData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageUsers" ADD CONSTRAINT "StageUsers_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
