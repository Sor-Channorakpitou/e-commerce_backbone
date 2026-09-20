import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Test 1: Immediate initial value
  it('returns initial value immediately upon mounting', () => {
    // Arrange & Act
    const { result } = renderHook(() => useDebounce('initial', 500));

    // Assert
    expect(result.current).toBe('initial');
  });

  // Test 2: Does not update before the specified delay elapses
  it('does not update debounced value before the delay has elapsed', () => {
    // Arrange
    let value = 'step1';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    // Act: Change value and advance timers partially (300ms < 500ms)
    value = 'step2';
    rerender();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Assert: Still holding previous value
    expect(result.current).toBe('step1');
  });

  // Test 3: Updates debounced value after full delay elapses
  it('updates debounced value once the full delay period passes', () => {
    // Arrange
    let value = 'alpha';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    // Act: Change value and advance timers past 500ms
    value = 'beta';
    rerender();
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Assert: New value has committed
    expect(result.current).toBe('beta');
  });

  // Test 4: Rapid typing / sequential changes - previous timeouts get cleared
  it('clears pending timeouts on rapid changes and commits only the final value', () => {
    // Arrange
    let value = 'r';
    const { result, rerender } = renderHook(() => useDebounce(value, 500));

    // Act: Simulate user rapidly typing "react" (each keystroke within 150ms)
    value = 're';
    rerender();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('r');

    value = 'rea';
    rerender();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('r');

    value = 'reac';
    rerender();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current).toBe('r');

    value = 'react';
    rerender();
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Assert: After 500ms of inactivity, only the final value commits
    expect(result.current).toBe('react');
  });

  // Test 5: Cleans up timer on unmount
  it('cleans up the active timeout when unmounted to prevent leaks', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    let value = 'test';
    const { rerender, unmount } = renderHook(() => useDebounce(value, 500));

    value = 'changed';
    rerender();

    // Act: Unmount before timer finishes
    unmount();

    // Assert: clearTimeout was invoked
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});
