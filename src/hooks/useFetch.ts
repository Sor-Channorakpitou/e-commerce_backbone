import { useState, useEffect } from 'react';

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Generic useFetch hook
 * Strictly typed with no hidden `any`.
 * Returns { data: T | null, loading: boolean, error: string | null }
 *
 * @param url The endpoint URL to fetch from
 * @returns State object with data narrowed to T | null, loading indicator, and error message
 */
export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController prevents race conditions and memory leaks on unmount
    const controller = new AbortController();
    const { signal } = controller;

    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} (${response.statusText})`);
        }

        // Parse response as unknown first, then cast to generic T
        const parsedJson: unknown = await response.json();

        if (isMounted) {
          setData(parsedJson as T);
          setError(null);
        }
      } catch (err: unknown) {
        // Ignore abort cancellations on unmount
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : 'An unexpected error occurred while fetching data.';
          setError(errorMessage);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
