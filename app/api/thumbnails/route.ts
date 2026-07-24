import { NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import {
  getThumbnailUrls,
  upsertThumbnailAsset,
  getThumbnailPathname,
  deleteThumbnailAsset,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

// Returns a map of movieId -> public thumbnail URL for every override.
export async function GET() {
  try {
    const thumbnails = await getThumbnailUrls();
    return NextResponse.json({ thumbnails });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { movieId, url, pathname, fileName } = await request.json();
    if (!movieId || !url || !pathname) {
      return NextResponse.json({ error: 'movieId, url and pathname are required' }, { status: 400 });
    }

    // Clean up the previous blob for this tile, if any, to avoid orphans.
    const old = await getThumbnailPathname(movieId);
    if (old && old !== pathname) {
      try { await del(old); } catch { /* ignore missing blob */ }
    }

    await upsertThumbnailAsset(movieId, url, pathname, fileName ?? null);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { movieId } = await request.json();
    if (!movieId) {
      return NextResponse.json({ error: 'movieId is required' }, { status: 400 });
    }
    const pathname = await getThumbnailPathname(movieId);
    if (pathname) {
      try { await del(pathname); } catch { /* ignore missing blob */ }
    }
    await deleteThumbnailAsset(movieId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
