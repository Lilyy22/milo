-- AlterEnum
ALTER TYPE "MessageDirection" ADD VALUE 'UNKNOWN';

-- AlterTable
ALTER TABLE "UpworkRooms" ADD COLUMN     "TTR" INTEGER NOT NULL DEFAULT 0;
