/*
  Warnings:

  - Added the required column `stageId` to the `TimeBilled` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeBilled" ADD COLUMN     "stageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeBilled" ADD CONSTRAINT "TimeBilled_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
