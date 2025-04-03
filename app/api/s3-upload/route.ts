import AWS from 'aws-sdk';
import { NextRequest, NextResponse } from 'next/server';

// Configure AWS SDK for DigitalOcean Spaces
const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');

const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET, 
});

// Function to convert ReadableStream to Buffer
const streamToBuffer = async (stream: ReadableStream<Uint8Array>): Promise<Buffer> => {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
};

// Function to upload file to DigitalOcean Spaces
const uploadToDigitalOcean = async (fileName: string, fileBuffer: Buffer) => {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET, // Your DigitalOcean Spaces bucket name
    Key: `videos/${fileName}`,            // Folder and file name in the bucket
    Body: fileBuffer,                     // The file buffer (content)
    ACL: 'public-read',                   // Set access permissions
  };

  try {
    const uploadResult = await s3.upload(params as AWS.S3.PutObjectRequest).promise();
    console.log('File uploaded successfully. URL:', uploadResult.Location);
    return uploadResult.Location; // Return the file URL after upload
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error; // Throw error to handle it in the calling function
  }
};

// Handle POST request to upload video
export async function POST(req: NextRequest) {
  try {
    // Convert the ReadableStream (req.body) to a Buffer
    const fileBuffer = await streamToBuffer(req.body as ReadableStream<Uint8Array>);

    // Extract the fileName from headers or request query (can also come from body)
    const fileName = req.headers.get('x-file-name');

    if (!fileName) {
      throw new Error('File name is missing.');
    }

    // Upload the file to DigitalOcean Spaces
    const url = await uploadToDigitalOcean(fileName, fileBuffer);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message });
    } else {
      return NextResponse.json({ success: false, error: 'An unknown error occurred' });
    }
  }
}