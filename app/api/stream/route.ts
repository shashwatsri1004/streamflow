import { type NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/blob';
import { getVideoPathname } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Streams a private-store video. Forwards the browser Range header so that
// seeking/scrubbing works via HTTP partial content (206) responses.
export async function GET(request: NextRequest) {
  const movieId = request.nextUrl.searchParams.get('id');
  if (!movieId) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const pathname = await getVideoPathname(movieId);
    if (!pathname) {
      return new NextResponse('Not found', { status: 404 });
    }

    const range = request.headers.get('range') ?? undefined;

    const result = await get(pathname, {
      access: 'private',
      headers: range ? { Range: range } : undefined,
    });

    if (!result || result.statusCode === 304 || !result.stream) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Copy through the content headers from origin (incl. range metadata).
    const headers = new Headers();
    const passthrough = ['content-type', 'content-length', 'content-range', 'accept-ranges'];
    for (const key of passthrough) {
      const value = result.headers.get(key);
      if (value) headers.set(key, value);
    }
    if (!headers.has('content-type') && result.blob.contentType) {
      headers.set('content-type', result.blob.contentType);
    }
    if (!headers.has('accept-ranges')) headers.set('accept-ranges', 'bytes');
    headers.set('cache-control', 'private, max-age=0, no-cache');

    // 206 when the origin honored the range request, otherwise 200.
    const status = range && result.headers.get('content-range') ? 206 : 200;

    return new NextResponse(result.stream, { status, headers });
  } catch (error) {
    console.error('[v0] stream error:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to stream video' }, { status: 500 });
  }
}
