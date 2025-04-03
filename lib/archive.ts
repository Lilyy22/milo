import fs from "fs-extra";
import path from "path";
import archiver from "archiver";

const ARCHIVE_TEMP_DIR = path.join(process.cwd(), "temp-downloads");

export async function archiveWebsite(websiteDir: string, websiteOutputName: string): Promise<string> {
    try {
        // Check if website directory exists
        if (!(await fs.pathExists(websiteDir))) {
            throw new Error(`Website directory does not exist: ${websiteDir}`);
        }

        await fs.ensureDir(ARCHIVE_TEMP_DIR);
        
        // Define archive path
        const archivePath = path.join(ARCHIVE_TEMP_DIR, `${websiteOutputName}.zip`);
    
        // Delete existing archive if it exists
        if (await fs.pathExists(archivePath)) await fs.remove(archivePath);

        // Create the writestream and archiver
        const output = fs.createWriteStream(archivePath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        // Set up error handling
        archive.on("warning", function(err) {
            if (err.code === "ENOENT") console.warn("Archive warning:", err);
            else throw err;
        });

        archive.on("error", function(err) {
            throw err;
        });

        return new Promise<string>((resolve, reject) => {
            output.on("close", () => resolve(archivePath));
            output.on("error", (err) => reject(err));

            archive.pipe(output);
            archive.directory(websiteDir, false);
            archive.finalize();
        });
    } catch (error) {
        console.error("Error in archiveWebsite:", error);
        throw error;
    }
}

export async function getWebsiteArchive(websiteOutputName: string): Promise<string> {
    const archivePath = path.join(ARCHIVE_TEMP_DIR, `${websiteOutputName}.zip`);

    if (await fs.pathExists(archivePath)) return archivePath;

    throw new Error(`Archive not found: ${archivePath}`);
}
