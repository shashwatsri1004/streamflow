import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

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
