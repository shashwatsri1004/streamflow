'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

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

/** Map of movieId -> public thumbnail URL for tiles that have a custom upload. */
export function useThumbnails() {
  const { data, error, isLoading, mutate } = useSWR<{ thumbnails: Record<string, string> }>(
    '/api/thumbnails',
    fetcher,
    { revalidateOnFocus: false },
  );
  return {
    thumbnails: data?.thumbnails ?? {},
    isLoading,
    error,
    mutate,
  };
}

/** Photos for a section ('gallery' or 'polaroid'). */
export function usePhotos(kind: 'gallery' | 'polaroid') {
  const { data, error, isLoading, mutate } = useSWR<{ photos: PhotoAsset[] }>(
    `/api/photos?kind=${kind}`,
    fetcher,
    { revalidateOnFocus: false },
  );
  return {
    photos: data?.photos ?? [],
    isLoading,
    error,
    mutate,
  };
}
