import { type NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import { getPhotos, insertPhoto, getPhotoPathname, deletePhoto } from '@/lib/db';

export const dynamic = 'force-dynamic';

function parseKind(value: string | null): 'gallery' | 'polaroid' | null {
  return value === 'gallery' || value === 'polaroid' ? value : null;
}

// GET /api/photos?kind=gallery|polaroid -> list of photos for that section.
export async function GET(request: NextRequest) {
  try {
    const kind = parseKind(request.nextUrl.searchParams.get('kind'));
    if (!kind) {
      return NextResponse.json({ error: 'kind must be "gallery" or "polaroid"' }, { status: 400 });
    }
    const photos = await getPhotos(kind);
    return NextResponse.json({ photos });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { kind, url, pathname, caption, tall } = await request.json();
    const validKind = parseKind(kind);
    if (!validKind || !url || !pathname) {
      return NextResponse.json({ error: 'kind, url and pathname are required' }, { status: 400 });
    }
    const photo = await insertPhoto(
      validKind,
      url,
      pathname,
      caption ? String(caption) : null,
      Boolean(tall),
    );
    return NextResponse.json({ photo });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    const pathname = await getPhotoPathname(String(id));
    if (pathname) {
      try { await del(pathname); } catch { /* ignore missing blob */ }
    }
    await deletePhoto(String(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
