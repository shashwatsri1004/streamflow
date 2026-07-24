import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

/* ------------------------------------------------------------------ */
/* Videos (private Blob, streamed via /api/stream)                     */
/* ------------------------------------------------------------------ */

export interface VideoAsset {
  movie_id: string;
  pathname: string;
  file_name: string | null;
  updated_at: string;
}

/** Returns a map of movieId -> blob pathname for all assigned videos. */
export async function getVideoPathnames(): Promise<Record<string, string>> {
  const rows = (await sql`SELECT movie_id, pathname FROM video_assets`) as {
    movie_id: string;
    pathname: string;
  }[];
  const map: Record<string, string> = {};
  for (const row of rows) map[row.movie_id] = row.pathname;
  return map;
}

export async function getVideoPathname(movieId: string): Promise<string | null> {
  const rows = (await sql`SELECT pathname FROM video_assets WHERE movie_id = ${movieId} LIMIT 1`) as {
    pathname: string;
  }[];
  return rows[0]?.pathname ?? null;
}

export async function upsertVideoAsset(
  movieId: string,
  pathname: string,
  fileName: string | null,
): Promise<void> {
  await sql`
    INSERT INTO video_assets (movie_id, pathname, file_name, updated_at)
    VALUES (${movieId}, ${pathname}, ${fileName}, now())
    ON CONFLICT (movie_id)
    DO UPDATE SET pathname = EXCLUDED.pathname, file_name = EXCLUDED.file_name, updated_at = now()
  `;
}

export async function deleteVideoAsset(movieId: string): Promise<void> {
  await sql`DELETE FROM video_assets WHERE movie_id = ${movieId}`;
}

/* ------------------------------------------------------------------ */
/* Tile thumbnails (public Blob, rendered directly in <img>)           */
/* ------------------------------------------------------------------ */

/** Returns a map of movieId -> public thumbnail URL for every override. */
export async function getThumbnailUrls(): Promise<Record<string, string>> {
  const rows = (await sql`SELECT movie_id, url FROM thumbnail_assets`) as {
    movie_id: string;
    url: string;
  }[];
  const map: Record<string, string> = {};
  for (const row of rows) map[row.movie_id] = row.url;
  return map;
}

export async function upsertThumbnailAsset(
  movieId: string,
  url: string,
  pathname: string,
  fileName: string | null,
): Promise<void> {
  await sql`
    INSERT INTO thumbnail_assets (movie_id, url, pathname, file_name, updated_at)
    VALUES (${movieId}, ${url}, ${pathname}, ${fileName}, now())
    ON CONFLICT (movie_id)
    DO UPDATE SET url = EXCLUDED.url, pathname = EXCLUDED.pathname, file_name = EXCLUDED.file_name, updated_at = now()
  `;
}

export async function getThumbnailPathname(movieId: string): Promise<string | null> {
  const rows = (await sql`SELECT pathname FROM thumbnail_assets WHERE movie_id = ${movieId} LIMIT 1`) as {
    pathname: string;
  }[];
  return rows[0]?.pathname ?? null;
}

export async function deleteThumbnailAsset(movieId: string): Promise<void> {
  await sql`DELETE FROM thumbnail_assets WHERE movie_id = ${movieId}`;
}

/* ------------------------------------------------------------------ */
/* Gallery + Polaroid photos (public Blob, rendered directly in <img>) */
/* ------------------------------------------------------------------ */

export interface PhotoAsset {
  id: string;
  kind: 'gallery' | 'polaroid';
  url: string;
  pathname: string;
  caption: string | null;
  tall: boolean;
  sort_order: number;
  created_at: string;
}

export async function getPhotos(kind: 'gallery' | 'polaroid'): Promise<PhotoAsset[]> {
  const rows = (await sql`
    SELECT id::text, kind, url, pathname, caption, tall, sort_order, created_at
    FROM photo_assets
    WHERE kind = ${kind}
    ORDER BY sort_order ASC, created_at ASC
  `) as PhotoAsset[];
  return rows;
}

export async function insertPhoto(
  kind: 'gallery' | 'polaroid',
  url: string,
  pathname: string,
  caption: string | null,
  tall: boolean,
): Promise<PhotoAsset> {
  const rows = (await sql`
    INSERT INTO photo_assets (kind, url, pathname, caption, tall, sort_order)
    VALUES (
      ${kind}, ${url}, ${pathname}, ${caption}, ${tall},
      COALESCE((SELECT MAX(sort_order) + 1 FROM photo_assets WHERE kind = ${kind}), 0)
    )
    RETURNING id::text, kind, url, pathname, caption, tall, sort_order, created_at
  `) as PhotoAsset[];
  return rows[0];
}

export async function getPhotoPathname(id: string): Promise<string | null> {
  const rows = (await sql`SELECT pathname FROM photo_assets WHERE id = ${id} LIMIT 1`) as {
    pathname: string;
  }[];
  return rows[0]?.pathname ?? null;
}

export async function deletePhoto(id: string): Promise<void> {
  await sql`DELETE FROM photo_assets WHERE id = ${id}`;
}
