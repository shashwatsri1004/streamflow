import { NextResponse } from 'next/server';
import { getVideoPathnames, upsertVideoAsset, deleteVideoAsset } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Returns a map of movieId -> playable stream URL (served from the private store).
export async function GET() {
  try {
    const pathnames = await getVideoPathnames();
    const assets: Record<string, string> = {};
    for (const movieId of Object.keys(pathnames)) {
      assets[movieId] = `/api/stream?id=${encodeURIComponent(movieId)}`;
    }
    return NextResponse.json({ assets });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { movieId, pathname, fileName } = await request.json();
    if (!movieId || !pathname) {
      return NextResponse.json({ error: 'movieId and pathname are required' }, { status: 400 });
    }
    await upsertVideoAsset(movieId, pathname, fileName ?? null);
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
    await deleteVideoAsset(movieId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
