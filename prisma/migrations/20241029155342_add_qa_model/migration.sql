-- CreateTable
CREATE TABLE "QA" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "fileId" TEXT,
    "fileName" TEXT,
    "clientId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QA_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QA" ADD CONSTRAINT "QA_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
