import { type NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary if credentials are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Helper to upload a buffer to Cloudinary via stream
const uploadFromBuffer = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'trip-canvas' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 });
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
        const result = await uploadFromBuffer(buffer);
        fileUrl = result.secure_url;
        fileType = result.resource_type === 'video' ? 'video' : 'image';
      } else {
        console.log(`Fallback: Saving ${originalName} to local public/uploads directory...`);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Sanitise filename
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
