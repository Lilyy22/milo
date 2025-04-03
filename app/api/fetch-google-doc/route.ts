import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = google.drive({ version: 'v3', auth: oAuth2Client });

export async function GET(req: NextRequest) {
  console.log('Fetching Google Drive content - started');
  const { searchParams } = new URL(req.url);
  const baseUrl = process.env.GOOGLE_DRIVE_BASE_URL;
  const folderId = searchParams.get('folderId');
  const driveUrl = folderId ? baseUrl + folderId : baseUrl + (process.env.GOOGLE_DRIVE_ACTIVE_CLIENTS_FOLDER_ID ?? ''); 
  console.log('driveUrl', driveUrl);
  if (!driveUrl) {
    console.error('CLIENT_GOOGLE_DRIVE_URL not configured in environment variables');
    return NextResponse.json({ error: 'Shared Google Drive URL not configured' }, { status: 500 });
  }

  console.log(`Attempting to fetch content from: ${driveUrl}`);

  try {
    const folderId = extractFolderId(driveUrl);
    if (!folderId) {
      console.error('Invalid Google Drive URL');
      return NextResponse.json({ error: 'Invalid Google Drive URL' }, { status: 400 });
    }

    console.log('Fetching items from the folder');
    const itemList = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)',
    });

    const items = itemList.data.files?.map(item => {
      const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
      return {
        ...item,
        type: isFolder ? 'folder' : 'file',
        icon: isFolder ? '📁' : '📄' // You can replace these with actual icon paths or codes
      };
    }) || [];

    console.log(`Found ${items.length} items in the folder`);

    console.log('Fetching Google Drive items - completed successfully');
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Error fetching Google Drive folders:', error);
    return NextResponse.json({ error: 'Failed to fetch Google Drive folders' }, { status: 500 });
  }
}

function extractFolderId(url: string): string | null {
  const match = url.match(/\/folders\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}