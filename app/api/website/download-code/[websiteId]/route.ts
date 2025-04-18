import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOption } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { archiveWebsite } from "@/lib/archive";
import fs from "fs-extra";
import path from "path";
import githubClient from "@/lib/github";

const DOWNLOAD_TEMP_DIR = path.join(process.cwd(), "temp-downloads");
type FilesToCleanup = { archivePath?: string; clonePath?: string };

export async function GET(
  req: NextRequest,
  { params }: { params: { websiteId: string } }
) {
  let filesToCleanup: FilesToCleanup = {};

  try {
    const session = await getServerSession(authOption);
    if (!session?.user)
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );

    const websiteId = params.websiteId;

    const website = await prisma.website.findUnique({
      where: { id: parseInt(websiteId) },
    });

    if (!website || !website.githubRepositoryUrl) {
      return NextResponse.json(
        { error: "Website not found or GitHub repository URL not available" },
        { status: 404 }
      );
    }

    await fs.ensureDir(DOWNLOAD_TEMP_DIR);

    const outputName = `website_${websiteId}_${Date.now()}`;
    const cloneDirPath = path.join(DOWNLOAD_TEMP_DIR, outputName);
    filesToCleanup.clonePath = cloneDirPath;

    try {
      console.log(`Cloning repository: ${website.githubRepositoryUrl}`);

      await githubClient.cloneRepository(
        website.githubRepositoryUrl,
        cloneDirPath
      );

      console.log("Creating archive from repository code");
      const archivePath = await archiveWebsite(cloneDirPath, outputName);
      filesToCleanup.archivePath = archivePath;

      const fileBuffer = await fs.readFile(archivePath);

      const response = new NextResponse(fileBuffer);

      response.headers.set(
        "Content-Disposition",
        `attachment; filename="website-code-${website.siteName}.zip"`
      );
      response.headers.set("Content-Type", "application/zip");

      setTimeout(() => cleanupFiles(filesToCleanup), 0);

      return response;
    } catch (error) {
      await cleanupFiles(filesToCleanup);
      throw error;
    }
  } catch (error) {
    console.error("Error downloading website code:", error);
    return NextResponse.json(
      {
        error: "Failed to download website code",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function cleanupFiles(files: FilesToCleanup) {
  try {
    if (files.archivePath && (await fs.pathExists(files.archivePath))) {
      await fs.remove(files.archivePath);
      console.log(`Removed archive: ${files.archivePath}`);
    }

    if (files.clonePath && (await fs.pathExists(files.clonePath))) {
      await fs.remove(files.clonePath);
      console.log(`Removed cloned repository: ${files.clonePath}`);
    }

    console.log("Cleanup completed successfully");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}
