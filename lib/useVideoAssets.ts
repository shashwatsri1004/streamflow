'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useVideoAssets() {
  const { data, error, isLoading, mutate } = useSWR<{ assets: Record<string, string> }>(
    '/api/videos',
    fetcher,
    { revalidateOnFocus: false },
  );
  return {
    assets: data?.assets ?? {},
    isLoading,
    error,
    mutate,
  };
}
