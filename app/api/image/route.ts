import { type NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';

export const dynamic = 'force-dynamic';

// Serves an image stored in the PRIVATE blob store. Photos and tile thumbnails
// are uploaded privately (the store is configured with private access), so they
// can't be rendered from a direct blob URL. We proxy them through this route and
// store `/api/image?path=<pathname>` as the image src in the database.
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('path');
  if (!pathname) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  try {
    const result = await get(pathname, { access: 'private' });

    if (!result || !result.stream) {
      return new NextResponse('Not found', { status: 404 });
    }

    const headers = new Headers();
    const contentType =
      result.headers.get('content-type') ?? result.blob.contentType ?? 'image/jpeg';
    headers.set('content-type', contentType);
    const contentLength = result.headers.get('content-length');
    if (contentLength) headers.set('content-length', contentLength);
    // Uploads use addRandomSuffix, so each pathname is immutable and safe to cache hard.
    headers.set('cache-control', 'public, max-age=31536000, immutable');

    return new NextResponse(result.stream, { status: 200, headers });
  } catch (error) {
    console.error('[v0] image proxy error:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
