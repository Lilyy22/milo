/*
  Warnings:

  - You are about to drop the `UpworkOrgId` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpworkUserId` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UpworkUserId" DROP CONSTRAINT "UpworkUserId_orgId_fkey";

-- DropTable
DROP TABLE "UpworkOrgId";

-- DropTable
DROP TABLE "UpworkUserId";

-- CreateTable
CREATE TABLE "UpworkOrg" (
    "id" TEXT NOT NULL,
    "isOur" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpworkOrg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpworkUser" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "photoUrl" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpworkUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UpworkUser" ADD CONSTRAINT "UpworkUser_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "UpworkOrg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
