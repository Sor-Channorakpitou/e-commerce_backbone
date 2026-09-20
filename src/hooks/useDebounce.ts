import { useState, useEffect, useRef } from 'react';

/**
 * useDebounce
 * 
 * Delays updating the debounced value until after a specified delay period has elapsed
 * since the last time the value was modified.
 * 
 * Rules of Hooks & Timing Audit:
 * 1. Name begins with 'use' (useDebounce).
 * 2. Uses useRef to hold the mutable timeout handle across renders without re-triggering effects.
 * 3. Strict cleanup: Every setTimeout is paired with clearTimeout in the effect cleanup.
 *    Without this cleanup, rapid keystrokes trigger multiple overlapping timers, causing
 *    flickering and stale state overwrites.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear any existing pending timer before scheduling a new one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Guaranteed cleanup on unmount or when value/delay changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
