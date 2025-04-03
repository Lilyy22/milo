-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INCOMING', 'OUTGOING');

-- AlterTable
ALTER TABLE "UpworkStories" ADD COLUMN     "author" TEXT,
ADD COLUMN     "direction" "MessageDirection";
