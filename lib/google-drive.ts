import { google } from "googleapis";
import fs from "fs-extra";
import path from "node:path";

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
);
oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = google.drive({ version: "v3", auth: oAuth2Client });

export async function uploadToGoogleDrive(filePath: string, websiteId: string): Promise<string> {
    try {
        const fileMetadata = {
            name: `${websiteId}.zip`,
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] as string[],
        };

        const media = {
            mimeType: "application/zip",
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: "id",
        });

        return response.data.id!;
    } catch (error) {
        console.error("Error uploading to Google Drive:", error);
        throw error;
    }
}

async function createFolderOnDrive(folderName: string): Promise<string> {
    const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] as string[],
    };

    const response = await drive.files.create({
        requestBody: fileMetadata,
        fields: "id",
    });

    return response.data.id!;
}

async function uploadFolderContents(folderPath: string, parentFolderId: string): Promise<void> {
    const files = await fs.readdir(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
            const fileMetadata = {
                name: file,
                parents: [parentFolderId],
            };
            const media = {
                body: fs.createReadStream(filePath),
            };
            await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: "id",
            });
        } else if (stats.isDirectory()) {
            const subfolderId = await createFolderOnDrive(file);
            await uploadFolderContents(filePath, subfolderId);
        }
    }
}

export async function updateGoogleDriveFile(fileId: string, filePath: string): Promise<void> {
    try {
        await drive.files.get({ fileId });

        const media = {
            mimeType: "application/zip",
            body: fs.createReadStream(filePath),
        };

        await drive.files.update({
            fileId: fileId,
            media: media,
        });
    } catch (error) {
        console.error("Error updating Google Drive file:", error);
        throw error;
    }
}
