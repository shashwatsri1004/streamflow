import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

// Client-upload handshake. Sends files directly from the browser to Blob,
// which bypasses the serverless request body limit so large videos work.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          'video/mp4',
          'video/quicktime',
          'video/webm',
          'video/x-matroska',
          'video/x-m4v',
        ],
        maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
        addRandomSuffix: true,
      }),
      // No onUploadCompleted: the client persists the movie mapping itself once
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
