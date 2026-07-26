import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isCloudinaryConfigured = !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

  if (!isCloudinaryConfigured) {
    return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 404 });
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = 'trip-canvas';
  const apiSecret = process.env.CLOUDINARY_API_SECRET as string;

  // Prepare parameters to sign (sorted alphabetically)
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const stringToSign = `${paramsToSign}${apiSecret}`;
  const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}

