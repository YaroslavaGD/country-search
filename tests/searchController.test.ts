import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import germany from './fixtures/germany.json';
import antarctica from './fixtures/antarctica.json';
import { createSearchController } from '../src/core/searchController';
import type { SearchState } from '../src/core/searchController';
import { searchCountries } from '../src/core/searchCountries';
import { HttpError } from '../src/core/errors';

const DEBOUNCE_MS = 300;
const API_URL = 'https://countries.dev/name/';

function setup() {
  const requests = new Map<
    string,
    {
      resolve: (response: Response) => void;
      reject: (error: Error) => void;
    }
  >();

  // Fake fetch: never answers on its own, rejects only when its signal is aborted.
  vi.mocked(fetch).mockImplementation((url, init) => {
    const signal = init?.signal;

    return new Promise<Response>((resolve, reject) => {
      requests.set(String(url), { resolve, reject });
      signal?.addEventListener('abort', () => reject(signal.reason));
    });
  });

  const states: SearchState[] = [];
  const controller = createSearchController({
    search: searchCountries,
    delay: DEBOUNCE_MS,
    onChange: (state) => states.push(state),
  });

  const respondWith = (query: string, countries: unknown[]) => {
    requests.get(`${API_URL}${query}`)?.resolve(new Response(JSON.stringify(countries)));
  };

  const rejectWith = (query: string, error: Error) => {
    requests.get(`${API_URL}${query}`)?.reject(error);
  };

  return { controller, states, respondWith, rejectWith };
}

describe('searchController', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('aborts the previous request as soon as the input changes', async () => {
    const { controller } = setup();
    controller.input('ge');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    const firstRequestSignal = vi.mocked(fetch).mock.calls[0][1]?.signal;

    controller.input('germany'); // debounce has not fired yet

    expect(firstRequestSignal?.aborted).toBe(true);
  });

  it('shows only the latest query result when the stale response arrives last', async () => {
    const { controller, states, respondWith } = setup();
    controller.input('ge');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    respondWith('germany', [germany]);
    respondWith('ge', [antarctica]); // late answer to the stale request
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({
      status: 'success',
      countries: [expect.objectContaining({ name: 'Germany' })],
    });
  });

  it('cancels the active request and resets state on empty input', async () => {
    const { controller, states } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    const firstRequestSignal = vi.mocked(fetch).mock.calls[0][1]?.signal;

    controller.input('');

    expect(firstRequestSignal?.aborted).toBe(true);
    expect(states.at(-1)).toEqual({ status: 'idle' });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('repeats last request with retry', async () => {
    const { controller, states, respondWith, rejectWith } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    rejectWith('germany', new HttpError(500, 'Server error'));
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({ status: 'error', kind: 'http' });

    controller.retry();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    expect(fetch).toHaveBeenCalledTimes(2);

    respondWith('germany', [germany]);
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({
      status: 'success',
      countries: [expect.objectContaining({ name: 'Germany' })],
    });
  });

  it('does not show an error when request is aborted', async () => {
    const { controller, states } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    const firstRequestSignal = vi.mocked(fetch).mock.calls[0][1]?.signal;

    controller.input('antarctica');
    expect(firstRequestSignal?.aborted).toBe(true);

    await vi.advanceTimersByTimeAsync(0);
    expect(states.some((state) => state.status === 'error')).toBe(false);
  });

  it('sets empty state when search returns no countries', async () => {
    const { controller, states, respondWith } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    respondWith('germany', []);
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({ status: 'empty' });
  });

  it('sets loading state while the search request is pending', async () => {
    const { controller, states } = setup();
    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    expect(states.at(-1)).toEqual({ status: 'loading' });
  });

  it('debounces rapid input changes and searches only the latest query', async () => {
    const { controller } = setup();

    controller.input('g');
    await vi.advanceTimersByTimeAsync(150);

    controller.input('ge');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);

    // 299ms
    expect(fetch).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}ge`,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('sets network error state when the request fails due to a network error', async () => {
    const { controller, states, rejectWith } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    rejectWith('germany', new TypeError('Failed to fetch'));
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({
      status: 'error',
      kind: 'network',
    });
  });

  it('sets timeout error state when the request times out', async () => {
    const { controller, states, rejectWith } = setup();

    controller.input('germany');
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);

    rejectWith('germany', new DOMException('The operation timed out', 'TimeoutError'));
    await vi.advanceTimersByTimeAsync(0);

    expect(states.at(-1)).toEqual({
      status: 'error',
      kind: 'timeout',
    });
  });
});
