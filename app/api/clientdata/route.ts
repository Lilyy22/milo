import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from "next/cache";
import { google } from 'googleapis';
import PDFParser from 'pdf2json';
import path from 'path';
import os from 'os';
import mammoth from 'mammoth';

const prisma = new PrismaClient();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const drive = google.drive({ version: 'v3', auth: oAuth2Client });


async function downloadFileFromDrive(drive: any, fileId: string): Promise<Buffer> {
  try {
    // First, try to get the file metadata
    const fileMetadata = await drive.files.get({ fileId, fields: 'mimeType' });
    const mimeType = fileMetadata.data.mimeType;

    // Check if it's a Google Docs file
    if (mimeType.includes('application/vnd.google-apps')) {
      // For Google Docs, we need to export
      const exportMimeType = 'application/pdf';  // Export as PDF
      const response = await drive.files.export(
        { fileId, mimeType: exportMimeType },
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    } else {
      // For other files, use the original download method
      const response = await drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'arraybuffer' }
      );
      return Buffer.from(response.data);
    }
  } catch (error) {
    console.error('Error downloading file from Drive:', error);
    throw error;
  }
}

async function parsePDFBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1);
    pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', () => {
      const parsedText = (pdfParser as any).getRawTextContent();
      resolve(parsedText);
    });
    pdfParser.parseBuffer(buffer);
  });
}

async function processFile(drive: any, fileId: string, fileName: string): Promise<string> {
  const fileBuffer = await downloadFileFromDrive(drive, fileId);
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (fileExtension === 'pdf') {
    return await parsePDFBuffer(fileBuffer);
  } else if (fileExtension === 'docx') {
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    return result.value;
  } else {
    // For files without recognized extensions or Google Docs files
    try {
      // First, try to parse as PDF
      return await parsePDFBuffer(fileBuffer);
    } catch (error) {
      // If PDF parsing fails, try extracting as DOCX
      try {
        const result = await mammoth.extractRawText({ buffer: fileBuffer });
        return result.value;
      } catch (docxError) {
        // If both methods fail, throw an error
        throw new Error(`Unable to process file: ${fileName}. Neither PDF nor DOCX parsing succeeded.`);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const parsedData = {
      clientName: formData.get('clientName') as string || '',
      gender: formData.get('gender') as string || '',
      bio: '',
      qa: '',
      qaName: '',
      bioName: '',
      qaFileId: '',
      bioFileId: '',
    };

    const bioFileId = formData.get('bioFileId') as string;
    const bioFileName = formData.get('bioFileName') as string;
    const qaFileId = formData.get('qaFileId') as string;
    const qaFileName = formData.get('qaFileName') as string;


    if (bioFileId && bioFileName) {
      parsedData.bio = await processFile(drive, bioFileId, bioFileName);
    }

    if (qaFileId && qaFileName) {
      parsedData.qa = await processFile(drive, qaFileId, qaFileName);
    }
    parsedData.qaName = qaFileName;
    parsedData.bioName = bioFileName;
    parsedData.qaFileId = qaFileId;
    parsedData.bioFileId = bioFileId;
    console.log('Parsed data:', parsedData);

    const newData = await prisma.clientData.create({
      data: parsedData,
    });
    console.log('Saved data:', newData);

    await revalidatePath('/projects');
    
    return NextResponse.json(newData, { status: 200 });
  } catch (error) {
    console.error('Error creating client data:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      try {
        const data = await prisma.clientData.findUnique({
          where: { id: parseInt(id) },
          include: { stages: true }, 
        });
        if (data) {
          return NextResponse.json(data, { status: 200 });
        } else {
          return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }
      } catch (error) {
        console.error('Error fetching data by ID:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
    } else {
      try {
        const allData = await prisma.clientData.findMany({
          include: { stages: true }, // Include stages relation
      });
        return NextResponse.json(allData, { status: 200 });
      } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
      }
    }
  }


export async function DELETE(req: NextRequest) {
    try {
      await prisma.clientData.deleteMany({});
      return NextResponse.json({ message: 'All rows deleted successfully.' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting rows:', error);
      return NextResponse.json({ error: 'Failed to delete rows' }, { status: 500 });
    }
  }

  export async function PATCH(req: NextRequest) {
    try {
      const formData = await req.formData();
      const id = formData.get('id');
      if (!id) {
        return NextResponse.json({ error: 'ID is required for updating' }, { status: 400 });
      }
      const parsedData = {
        clientName: formData.get('clientName') as string || '',
        gender: formData.get('gender') as string || '',
        bio: '',
        qa: '',
        qaName: '',
        bioName: '',
        qaFileId: '',
        bioFileId: '',
      };
  
      const bioFileId = formData.get('bioFileId') as string;
      const bioFileName = formData.get('bioFileName') as string;
      const qaFileId = formData.get('qaFileId') as string;
      const qaFileName = formData.get('qaFileName') as string;
  
  
      if (bioFileId && bioFileName) {
        parsedData.bio = await processFile(drive, bioFileId, bioFileName);
      }
  
      if (qaFileId && qaFileName) {
        parsedData.qa = await processFile(drive, qaFileId, qaFileName);
      }
      parsedData.qaName = qaFileName;
      parsedData.bioName = bioFileName;
      parsedData.qaFileId = qaFileId;
      parsedData.bioFileId = bioFileId;
      console.log('Parsed data:', parsedData);
      const updatedData = await prisma.clientData.update({
        where: { id: parseInt(id as string) },
        data: parsedData,
      });
  
      return NextResponse.json(updatedData, { status: 200 });
    } catch (error) {
      console.error('Error updating data:', error);
      return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
  }