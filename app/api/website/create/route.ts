import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "@/schemas/create-website";
import githubClient from "@/lib/github";
import vercelClient from "@/lib/vercel";
import websiteGenerator from "@/lib/website-generator";
import { Prisma } from "@prisma/client";

type FilesToCleanup = {
  constantsPath?: string;
  websitePath?: string;
  websiteArchivePath?: string;
  layoutPath?: string;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOption);
  if (!session?.user)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );

  const data = await req.json();
  const validationResult = createRequestSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const { websiteData, clientId } = validationResult.data;

  let filesToCleanup: FilesToCleanup = {};

  const isWebsiteExists = await prisma.website.findFirst({
    where: { clientId },
  });
  if (isWebsiteExists) {
    return NextResponse.json(
      {
        redirect: true,
        websiteId: isWebsiteExists.id,
        redirectUrl: "/projects",
        message:
          "Website already exists for this client. Redirecting to projects page.",
      },
      { status: 302 }
    );
  }

  const client = await prisma.clientData.findUnique({
    where: { id: clientId },
  });
  if (!client)
    return NextResponse.json({ error: "Client not found" }, { status: 404 });

  try {
    const projectName = `website-${client.clientName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")}`;

    const website = await prisma.website.create({
      data: {
        clientId,
        projectName,
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
        assets: websiteData.assets || {},
        isPublished: websiteData.isPublished || false,
      },
    });

    const { newWebsiteDir, newConstantsPath, newLayoutPath } =
      await websiteGenerator.generateWebsite(
        websiteData,
        website.id.toString()
      );

    filesToCleanup.constantsPath = newConstantsPath;
    filesToCleanup.websitePath = newWebsiteDir;
    filesToCleanup.layoutPath = newLayoutPath;

    const { repositoryUrl, cloneUrl } = await githubClient.createRepository(
      projectName,
      `Website for ${client.clientName} - Generated by Reputation Rhino`
    );

    console.log("Starting GitHub deployment process...");
    await githubClient.deployWebsite(newWebsiteDir, cloneUrl);

    const updatedWebsite = await prisma.website.update({
      where: { id: website.id },
      data: {
        githubRepositoryUrl: repositoryUrl,
        lastBuildAt: new Date(),
      },
    });

    console.log("Starting website archiving process...");

    console.log("Starting Vercel deployment process...");
    try {
      const { vercelProjectId, vercelDeploymentId } =
        await vercelClient.deployToVercel({ repositoryUrl, projectName });

      await prisma.website.update({
        where: { id: website.id },
        data: { vercelDeploymentId, vercelProjectId },
      });
    } catch (error) {
      console.error("Vercel deployment failed:", error);
    }

    return NextResponse.json({ website: updatedWebsite });
  } catch (error) {
    console.error("Website generation, deployment or archiving failed:", error);
    return NextResponse.json(
      {
        error: "Failed to generate, deploy or archive website",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await websiteGenerator.cleanup(filesToCleanup);
  }
}
