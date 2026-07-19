import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

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
