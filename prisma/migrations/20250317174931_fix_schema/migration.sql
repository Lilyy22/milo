-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('basic', 'elite');

-- CreateTable
CREATE TABLE "Website" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "domain" TEXT,
    "siteName" TEXT NOT NULL,
    "description" TEXT,
    "pages" TEXT[] DEFAULT ARRAY['/home', '/about', '/blog', '/news', '/contact']::TEXT[],
    "template" "TemplateType" NOT NULL DEFAULT 'basic',
    "googleAnalyticsId" TEXT,
    "searchConsoleId" TEXT,
    "homePageContent" JSONB,
    "aboutPageContent" JSONB,
    "blogPageContent" JSONB,
    "newsPageContent" JSONB,
    "contactPageContent" JSONB,
    "socialLinks" JSONB NOT NULL,
    "assets" JSONB NOT NULL,
    "githubRepositoryUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "lastBuildAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Website" ADD CONSTRAINT "Website_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
