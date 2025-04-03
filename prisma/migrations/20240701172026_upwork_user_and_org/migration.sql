-- CreateTable
CREATE TABLE "UpworkOrgId" (
    "id" TEXT NOT NULL,
    "isOur" BOOLEAN NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpworkOrgId_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpworkUserId" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "photoUrl" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UpworkUserId_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UpworkUserId" ADD CONSTRAINT "UpworkUserId_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "UpworkOrgId"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
