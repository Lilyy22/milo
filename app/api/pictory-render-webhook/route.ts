import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import stream from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client, PutObjectCommandInput, ObjectCannedACL } from "@aws-sdk/client-s3";
import { revalidatePath } from 'next/cache'; // Import revalidatePath
// import { CannedACL } from '@aws-sdk/client-s3'; // Use CannedACL instead

const prisma = new PrismaClient();

const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;

if (!spacesKey || !spacesSecret) {
    throw new Error("S3 credentials are not defined");
}

const s3Client = new S3Client({
    endpoint: "https://nyc3.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
        accessKeyId: spacesKey,
        secretAccessKey: spacesSecret
    }
});
// Function to save video to DigitalOcean Spaces
const saveVideoToSpace = async (videoUrl: string, jobId: string) => {
    console.log(`Attempting to fetch video from URL: ${videoUrl}`);

    try {
        const response = await fetch(videoUrl);
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`);
        }
        
        if (!response.body) {
            throw new Error("Response body is null");
        }
        const passThroughStream = new stream.PassThrough();
        response.body.pipe(passThroughStream);
        const title = `videos/${jobId}.mp4`;
        const params = {
            Bucket: process.env.DO_SPACES_BUCKET,
            Key: title,
            Body: passThroughStream,
            ContentType: "video/mp4",
            ACL: 'public-read' as ObjectCannedACL // Change this to a valid canned ACL type
        };

        const upload = new Upload({
            client: s3Client,
            params: params,
        });

        await upload.done();
        console.log("Successfully uploaded video: ", params.Key);

        // Link the video to the database
        const stage = await prisma.stage.findFirst({
            where: { pictoryJobId: jobId } // Adjusted to match the existing jobId
        });

        if (stage) {
            await prisma.stage.update({
                where: { id: stage.id }, // Assuming 'id' is the primary key
                data: {
                    videoUrl: params.Key,
                    status: 'Ready'
                    // Update other fields as necessary
                }
                
            });

        } else {
            console.error("Stage not found for jobId:", jobId);
            // await prisma.stage.update({
            //     where: { id: stage?.id }, // Assuming 'id' is the primary key
            //     data: {
            //         status: 'Failed'
            //         // Update other fields as necessary
            //     }
            // }); // Moved closing bracket here
            throw new Error("Stage not found");
        }
    } catch (err) {
        console.error("Error saving video to DO:", err);
        throw new Error(`S3 upload error: ${(err as Error).message}`); // Type assertion added
    }
};

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('Incoming webhook data:', data);

        const jobId = data.job_id;
        const success = data.success;
        const videoUrl = data.data?.videoURL; // Use the new structure

        if (!jobId || !success || !videoUrl) {
            return NextResponse.json({ success: false, error: 'Invalid webhook data' }, { status: 400 });
        }

        await saveVideoToSpace(videoUrl, jobId); // Save video to DO and link to DB

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing Pictory webhook:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}