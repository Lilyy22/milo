import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import githubClient from "@/lib/github";
import vercelClient from "@/lib/vercel";
import websiteGenerator from "@/lib/website-generator";
import { updateRequestSchema } from "@/schemas/update-website";
import { Prisma } from "@prisma/client";
import fs from "fs-extra";

type FilesToCleanup = {
  constantsPath?: string;
  websitePath?: string;
  websiteArchivePath?: string;
  layoutPath?: string;
};

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOption);
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );

  const data = await req.json();
  const validationResult = updateRequestSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const { websiteData, clientId } = validationResult.data;
  let filesToCleanup: FilesToCleanup = {};

  const isWebsiteExists = await prisma.website.findUnique({
    where: { clientId },
  });
  if (!isWebsiteExists || !isWebsiteExists.githubRepositoryUrl) {
    return NextResponse.json(
      { error: "Website not found or GitHub repository URL not available" },
      { status: 404 }
    );
  }

  console.log("Starting website update process...");

  try {
    const { newWebsiteDir, newConstantsPath, newLayoutPath } =
      await websiteGenerator.generateWebsite(
        websiteData,
        isWebsiteExists.id.toString()
      );

    console.log("Updating GitHub repository with new content...");
    await githubClient.updateRepository({
      websiteDir: newWebsiteDir,
      repositoryUrl: isWebsiteExists.githubRepositoryUrl,
    });

    let deployment;
    if (isWebsiteExists.vercelProjectId) {
      try {
        console.log("Triggering Vercel deployment...");
        deployment = await vercelClient.deployToVercel({
          repositoryUrl: isWebsiteExists.githubRepositoryUrl,
          projectName: isWebsiteExists.vercelProjectId.toLowerCase(),
        });
        console.log("Vercel deployment triggered successfully");
      } catch (error) {
        console.error("Failed to trigger Vercel deployment:", error);
      }
    }

    await prisma.website.update({
      where: { id: isWebsiteExists.id },
      data: {
        siteName: websiteData.siteName,
        description: websiteData.description,
        pages: websiteData.pages,
        template: websiteData.template,
        googleAnalyticsId: websiteData.googleAnalyticsId,
        searchConsoleId: websiteData.searchConsoleId,
        homePageContent: websiteData.homePageContent,
        aboutPageContent: websiteData.aboutPageContent,
        blogPageContent: websiteData.blogPageContent || Prisma.JsonNull,
        newsPageContent: websiteData.newsPageContent || Prisma.JsonNull,
        contactPageContent: websiteData.contactPageContent || Prisma.JsonNull,
        socialLinks: websiteData.socialLinks || {},
        vercelProjectId:
          deployment?.vercelProjectId ?? isWebsiteExists.vercelProjectId,
        assets: websiteData.assets || {},
        lastBuildAt: new Date(),
      },
    });
    filesToCleanup.websitePath = newWebsiteDir;
    filesToCleanup.constantsPath = newConstantsPath;
    filesToCleanup.layoutPath = newLayoutPath;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Website update failed:", error);
    return NextResponse.json(
      {
        error: "Failed to update website",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await websiteGenerator.cleanup(filesToCleanup);
  }
}
