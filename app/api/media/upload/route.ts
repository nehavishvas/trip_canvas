import { type NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const isVercel = process.env.VERCEL === '1';

// Upload a buffer to Cloudinary using standard fetch REST API (no SDK dependency)
async function uploadToCloudinaryRest(fileBuffer: Buffer, fileName: string, fileExt: string): Promise<{ secure_url: string; resource_type: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are missing');
  }

  let resourceType = 'image';
  if (['.mp4', '.mov', '.webm', '.avi', '.mkv'].includes(fileExt.toLowerCase())) {
    resourceType = 'video';
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'trip-canvas';

  // Prepare parameters to sign (sorted alphabetically)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const stringToSign = `${paramsToSign}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)]);
  formData.append('file', blob, fileName);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp.toString());
  formData.append('folder', folder);
  formData.append('signature', signature);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cloudinary upload failed: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return {
    secure_url: data.secure_url,
    resource_type: data.resource_type,
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (isVercel && !isCloudinaryConfigured) {
      return Response.json({
        error: 'Missing Cloudinary Environment Variables',
        message: 'Your Vercel deployment does not have Cloudinary configured. Please go to Vercel Dashboard -> Project Settings -> Environment Variables, and add: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'
      }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const originalName = file.name;
      const fileExt = path.extname(originalName);

      let fileUrl = '';
      let fileType: 'image' | 'video' = 'image';

      if (isCloudinaryConfigured) {
        console.log(`Uploading ${originalName} to Cloudinary...`);
        const result = await uploadToCloudinaryRest(buffer, originalName, fileExt);
        fileUrl = result.secure_url;
        fileType = result.resource_type === 'video' ? 'video' : 'image';
      } else {
        console.log(`Fallback: Saving ${originalName} to local public/uploads directory...`);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const fileBase = path.basename(originalName, fileExt)
          .replace(/[^a-zA-Z0-9]/g, '_')
          .toLowerCase();
        
        const uniqueName = `${fileBase}_${Date.now()}${fileExt}`;
        const filePath = path.join(uploadDir, uniqueName);

        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/${uniqueName}`;

        const mime = file.type || '';
        if (mime.startsWith('video/') || ['.mp4', '.mov', '.webm', '.avi', '.mkv'].includes(fileExt.toLowerCase())) {
          fileType = 'video';
        }
      }

      uploadedFiles.push({
        file_url: fileUrl,
        file_type: fileType,
        file_name: originalName
      });
    }

    return Response.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error: any) {
    console.error('Error in media upload handler:', error);
    return Response.json({
      error: 'Internal server error',
      message: error.message || String(error),
      stack: error.stack
    }, { status: 500 });
  }
}
