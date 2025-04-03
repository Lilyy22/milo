-- AlterTable
ALTER TABLE "UpworkRooms" ADD COLUMN     "roomCreated" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "UpworkRequestsLog" (
    "id" SERIAL NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "UpworkRequestsLog_pkey" PRIMARY KEY ("id")
);
