import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch'; // Import fetch for API requests and downloading video
import { PutObjectCommand } from '@aws-sdk/client-s3'; // Import PutObjectCommand
import { S3Client } from '@aws-sdk/client-s3'; // Import S3Client
import stream from 'stream'; // Import stream module
import { Upload } from '@aws-sdk/lib-storage'; // Import Upload from lib-storage

const prisma = new PrismaClient();

const spacesKey = process.env.DO_SPACES_KEY;
const spacesSecret = process.env.DO_SPACES_SECRET;
const PICTORY_API_URL = 'https://api.pictory.ai/pictoryapis/v1';


if (!spacesKey || !spacesSecret) {
    throw new Error("S3 credentials are not defined");
}

async function getPictoryAccessToken() {
  const tokenUrl = `${PICTORY_API_URL}/oauth2/token`;
  const body = JSON.stringify({
    client_id: process.env.PICTORY_CLIENT_ID,
    client_secret: process.env.PICTORY_CLIENT_SECRET
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  });

  if (!response.ok) {
    throw new Error(`Failed to get Pictory access token: ${response.statusText}`);
  }
  const data = await response.json() as { access_token: string };
  return data.access_token;
}


// Function to initiate video rendering
const initiateVideoRender = async (renderParams: object) => {
    console.log('Initiating video render');
    const accessToken = await getPictoryAccessToken();

    const response = await fetch('https://api.pictory.ai/pictoryapis/v1/video/render', {
        method: 'POST',
        headers: {
            'Authorization': accessToken,
            'X-Pictory-User-Id': process.env.X_PICTORY_USER_ID!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...renderParams, // Include existing render parameters
             webhook: `${process.env.WEBHOOK_URL}/api/pictory-render-webhook`
        })
    });

    const data = await response.json() as { message?: string }; // Type assertion added
    if (!response.ok) {
        console.error('Render API error:', data);
        throw new Error(`Render API error: ${data.message || response.statusText}`);
    }

    // console.log('Render API initiated. Job ID:', data);
    return (data as { data: { job_id: string } }).data.job_id; // Type assertion added
};



export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        console.log('Received webhook data:', data);
        const jobId = data.job_id;
        const success = data.success;
        const videoUrl = data.data?.preview;
        const renderParams = data.data.renderParams
        if (!jobId || !success || !videoUrl) {
            console.error('Validation error: Invalid webhook data', data); // Log validation error
            return NextResponse.json({ success: false, error: 'Invalid webhook data' }, { status: 400 });
        }

        const stage = await prisma.stage.findFirst({
            where: { pictoryJobId: jobId }
        });

        if (!stage) {
            console.error('No matching stage found for job_id:', jobId); // Log no stage found
            return NextResponse.json({ success: false, error: 'No matching stage found' }, { status: 404 });
        }

        if (success) {
            console.log(`Job ${jobId} completed. Starting the next webhook...`); // Log job completion
            const new_jobId = await initiateVideoRender(renderParams);
            await prisma.stage.update({
                where: { id: stage.id }, // Use the unique id of the stage
                data: { pictoryJobId: new_jobId } // Update the jobId field with the new job_id
            });
        } else {
            console.log(`Job ${jobId} failed. Updating stage with error message...`); // Log job failure
            await prisma.stage.update({
                where: { id: stage.id },
                data: {
                    status: 'failed',
                    videoErrorMessage: data.error_message
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error processing Pictory webhook:', error); // Log any errors
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
