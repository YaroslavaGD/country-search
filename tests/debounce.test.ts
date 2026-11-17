import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { debounce } from '../src/core/debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not call fn before the delay has passed', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(299);

    expect(fn).not.toHaveBeenCalled();
  });

  it('calls fn once after the delay', () => {
    const fn = vi.fn();

    const debounced = debounce(fn, 300);

    debounced();
    debounced();
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer on every new call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(200);
    debounced();
    vi.advanceTimersByTime(200);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes the arguments of the last call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);

    debounced('ge');
    debounced('germany');
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledWith('germany');
  });

  it('calls fn again for calls made after the delay', () => {
    const fn = vi.fn();

    const debounced = debounce(fn, 300);

    debounced();
    vi.advanceTimersByTime(300);
    debounced();
    vi.advanceTimersByTime(300);

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
