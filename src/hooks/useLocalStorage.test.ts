import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  // Test 1: Fallback to initial value when storage is empty
  it('initializes with the provided fallback value when localStorage is empty', () => {
    // Arrange & Act
    const { result } = renderHook(() => useLocalStorage('test-key', 'default-value'));

    // Assert
    expect(result.current[0]).toBe('default-value');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('default-value'));
  });

  // Test 2: Reads preexisting item from localStorage
  it('initializes with preexisting value stored in localStorage', () => {
    // Arrange: Pre-populate storage
    window.localStorage.setItem('existing-key', JSON.stringify({ theme: 'dark' }));

    // Act
    const { result } = renderHook(() =>
      useLocalStorage('existing-key', { theme: 'light' })
    );

    // Assert
    expect(result.current[0]).toEqual({ theme: 'dark' });
  });

  // Test 3: Updating state syncs to localStorage
  it('updates state and persists changes to localStorage when setter is called', () => {
    // Arrange
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    // Act: Update to 42
    act(() => {
      result.current[1](42);
    });

    // Assert
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(window.localStorage.getItem('counter') || '')).toBe(42);
  });

  // Test 4: Supports functional state updates (e.g., prev => prev + 1)
  it('supports functional updater syntax', () => {
    // Arrange
    const { result } = renderHook(() => useLocalStorage('count', 10));

    // Act
    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    // Assert
    expect(result.current[0]).toBe(15);
    expect(JSON.parse(window.localStorage.getItem('count') || '')).toBe(15);
  });

  // Test 5: Edge Case - Corrupted JSON fallback
  it('falls back to initialValue without throwing when localStorage contains invalid JSON', () => {
    // Arrange: Corrupt stored data
    window.localStorage.setItem('corrupt-key', 'NOT_VALID_JSON{');

    // Act
    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'safe-fallback'));

    // Assert
    expect(result.current[0]).toBe('safe-fallback');
  });
});
