import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();
const PICTORY_API_URL = 'https://api.pictory.ai/pictoryapis/v1';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = google.drive({ version: 'v3', auth: oAuth2Client });
const docs = google.docs({ version: 'v1', auth: oAuth2Client });

async function fetchArticleFromGoogleDocs(docId: string): Promise<string> {
  const doc = await docs.documents.get({ documentId: docId });
  const content = doc.data.body?.content?.reduce((text: string, item: any) => {
    return text + (item.paragraph?.elements?.reduce((t: string, e: any) => t + (e.textRun?.content || ''), '') || '');
  }, '') || '';
  return content;
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

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { stageId, clientId, category, fileId } = await request.json();

    // Fetch stage and client data
    const stage = await prisma.stage.findUnique({ where: { id: stageId } });
    const client = await prisma.clientData.findUnique({ where: { id: clientId } });
    if (!stage || !client) {
      return NextResponse.json({ success: false, error: 'Stage or client not found' });
    }

    // Fetch file content from Google Docs
    const content = await fetchContentFromGoogleDocs(fileId);

    // Determine voiceover speaker based on client gender
    const speaker = client.gender === 'female' ? "Annabell" : "Djano";

    // Prepare data for Pictory API
    const pictoryData = {
      audio: {
        aiVoiceOver: {
          speaker: speaker,
          speed: "100",
          amplifyLevel: "1"
        },
        autoBackgroundMusic: false,
        backGroundMusicVolume: 0
      },
      captions: true,
      videoName: `${client.clientName} - ${category}`,
      videoDescription: `${stage.name} video for ${client.clientName}`,
      language: "en",
      videoWidth: "1280", // Reduced width for lower quality
      videoHeight: "720", // Reduced height for lower quality
      scenes: [
        {
          text: content,
          voiceOver: true,
          splitTextOnNewLine: true,
          splitTextOnPeriod: true,
        }
      ],
      webhook: `${process.env.WEBHOOK_URL}/api/pictory-webhook`
    };

    console.log('Request body:', JSON.stringify(pictoryData, null, 2));

    // Get Pictory access token
    const accessToken = await getPictoryAccessToken();

    // Call Pictory API to generate video storyboard
    const storyboardResponse = await fetch(`${PICTORY_API_URL}/video/storyboard`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-Pictory-User-Id': process.env.X_PICTORY_USER_ID!
      },
      body: JSON.stringify(pictoryData)
    });

    if (!storyboardResponse.ok) {
      const errorBody = await storyboardResponse.text();
      console.error('Storyboard response error:', storyboardResponse.status, storyboardResponse.statusText);
      console.error('Error body:', errorBody);
      throw new Error(`Pictory API error: ${storyboardResponse.status} ${storyboardResponse.statusText}. Body: ${errorBody}`);
    }

    const storyboardData = await storyboardResponse.json();
    if (!storyboardData.success) {
      throw new Error(`Pictory API returned success: false. Message: ${storyboardData.message || 'No error message provided'}`);
    }

    const jobId = storyboardData.data.job_id;

    // Update stage with the job ID
    await prisma.stage.update({
      where: { id: stageId },
      data: { pictoryJobId: jobId }
    });

    return NextResponse.json({ success: true, jobId });

  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate video', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function fetchContentFromGoogleDocs(fileId: string): Promise<string> {
  try {
    const doc = await docs.documents.get({ documentId: fileId });
    const content = doc.data.body?.content?.reduce((text: string, item: any) => {
      return text + (item.paragraph?.elements?.reduce((t: string, e: any) => t + (e.textRun?.content || ''), '') || '');
    }, '') || '';
    return content;
  } catch (error) {
    console.error('Error fetching content from Google Docs:', error);
    throw new Error('Failed to fetch content from Google Docs');
  }
}