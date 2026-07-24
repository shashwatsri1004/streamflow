import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

// Client-upload handshake for images (gallery photos, polaroids, tile thumbnails).
// Images are stored with PUBLIC access so they can be rendered directly in <img>.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        access: 'public',
        allowedContentTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/avif',
          'image/heic',
        ],
        maximumSizeInBytes: 25 * 1024 * 1024, // 25 MB
        addRandomSuffix: true,
      }),
      // No onUploadCompleted: the client persists the DB row itself once
      // upload() resolves. Providing it would require a publicly reachable
      // callback URL, which isn't available in preview/localhost and causes
      // token generation to fail (stalling the upload).
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
