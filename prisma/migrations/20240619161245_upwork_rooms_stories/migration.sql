-- CreateTable
CREATE TABLE "UpworkRooms" (
    "roomId" TEXT NOT NULL,
    "roomName" TEXT NOT NULL,
    "roomType" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,
    "recentTimestamp" BIGINT NOT NULL,
    "fullRoomObject" JSONB NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpworkRooms_pkey" PRIMARY KEY ("roomId")
);

-- CreateTable
CREATE TABLE "UpworkStories" (
    "roomId" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "created" BIGINT NOT NULL,
    "markedAsAbusive" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "modified" INTEGER NOT NULL,
    "updated" BIGINT NOT NULL,
    "userId" TEXT NOT NULL,
    "userModifiedTimestamp" BIGINT NOT NULL,
    "fullStoryObject" JSONB NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpworkStories_pkey" PRIMARY KEY ("storyId")
);

-- AddForeignKey
ALTER TABLE "UpworkStories" ADD CONSTRAINT "UpworkStories_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "UpworkRooms"("roomId") ON DELETE RESTRICT ON UPDATE CASCADE;
