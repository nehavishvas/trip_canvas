import { type NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Sanitise filename
      const originalName = file.name;
      const fileExt = path.extname(originalName);
      const fileBase = path.basename(originalName, fileExt)
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase();
      
      // Unique name using timestamp
      const uniqueName = `${fileBase}_${Date.now()}${fileExt}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Save file
      await fs.writeFile(filePath, buffer);

      // Determine file type (image or video)
      let fileType: 'image' | 'video' = 'image';
      const mime = file.type || '';
      if (mime.startsWith('video/') || ['.mp4', '.mov', '.webm', '.avi', '.mkv'].includes(fileExt.toLowerCase())) {
        fileType = 'video';
      }

      uploadedFiles.push({
        file_url: `/uploads/${uniqueName}`,
        file_type: fileType,
        file_name: originalName
      });
    }

    return Response.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Error in media upload handler:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
