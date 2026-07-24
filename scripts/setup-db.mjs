import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

// --- Videos ---
// Private Blob store: we persist the blob pathname and serve via a signed stream route.
await sql`
  CREATE TABLE IF NOT EXISTS video_assets (
    movie_id TEXT PRIMARY KEY,
    pathname TEXT NOT NULL,
    file_name TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

// Migrate older shape (video_url) -> pathname if it exists.
await sql`ALTER TABLE video_assets ADD COLUMN IF NOT EXISTS pathname TEXT`;
await sql`ALTER TABLE video_assets DROP COLUMN IF EXISTS video_url`;
console.log('video_assets table ready');

// --- Tile thumbnails ---
// Public Blob store: the URL is rendered directly in <img>. One override per movie tile.
await sql`
  CREATE TABLE IF NOT EXISTS thumbnail_assets (
    movie_id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    pathname TEXT NOT NULL,
    file_name TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
console.log('thumbnail_assets table ready');

// --- Gallery + Polaroid photos ---
// Public Blob store: photos shown directly in <img>. `kind` = 'gallery' | 'polaroid'.
await sql`
  CREATE TABLE IF NOT EXISTS photo_assets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind TEXT NOT NULL,
    url TEXT NOT NULL,
    pathname TEXT NOT NULL,
    caption TEXT,
    tall BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
await sql`CREATE INDEX IF NOT EXISTS photo_assets_kind_idx ON photo_assets (kind, sort_order, created_at)`;
console.log('photo_assets table ready');
