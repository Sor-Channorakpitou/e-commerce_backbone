import { useState, useEffect } from 'react';

/**
 * useLocalStorage
 * 
 * Hand-crafted custom hook to persist and sync state with window.localStorage.
 * 
 * Rules of Hooks Audit:
 * 1. Name begins with 'use' (useLocalStorage).
 * 2. Calls only React hooks (useState, useEffect) at the top level unconditionally.
 * 3. Lazy initializer in useState prevents reading from storage on every render.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Lazy state initializer: reads localStorage once on mount
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
    } catch {
      // Fallback safely to initialValue if storage read or parse fails
    }

    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Gracefully handle storage quota or write errors
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
