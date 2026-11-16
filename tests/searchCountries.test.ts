import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import germany from './fixtures/germany.json';
import { searchCountries } from '../src/core/searchCountries';
import { HttpError } from '../src/core/errors';

describe('searchCountries', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('returns mapped countries on a 200 response', async () => {
    const answer = new Response(JSON.stringify([germany]), { status: 200 });
    vi.mocked(fetch).mockResolvedValue(answer);

    const result = await searchCountries('germany', new AbortController().signal);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Germany');
  });

  it('returns empty array on a 404 response', async () => {
    const answer = new Response(null, { status: 404, statusText: 'Country not found' });
    vi.mocked(fetch).mockResolvedValue(answer);

    const result = await searchCountries('germany', new AbortController().signal);

    expect(result).toEqual([]);
  });

  it.each([400, 500])('throws HttpError with status %i on a failed response', async (status) => {
    const answer = new Response(null, { status });
    vi.mocked(fetch).mockResolvedValue(answer);

    const promise = searchCountries('germany', new AbortController().signal);

    await expect(promise).rejects.toBeInstanceOf(HttpError);
    await expect(promise).rejects.toMatchObject({ name: 'HttpError', status });
  });

  it('encodes the query in the request URL', async () => {
    const answer = new Response(JSON.stringify([]), { status: 200 });
    vi.mocked(fetch).mockResolvedValue(answer);

    await searchCountries('united states', new AbortController().signal);

    const [requestedUrl] = vi.mocked(fetch).mock.calls[0];
    expect(requestedUrl).toBe('https://countries.dev/name/united%20states');
  });

  it('rejects with AbortError when the signal is aborted', async () => {
    // Replaces fetch with a version that never responds and rejects only on abort.
    vi.mocked(fetch).mockImplementation((_url, init) => {
      const signal = init?.signal;

      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason));
      });
    });

    const controller = new AbortController();

    const promise = searchCountries('germany', controller.signal);
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });

  it('rejects with TimeoutError when request takes too long', async () => {
    vi.mocked(fetch).mockImplementation((_url, init) => {
      const signal = init?.signal;

      return new Promise<Response>((_resolve, reject) => {
        signal?.addEventListener('abort', () => reject(signal.reason));
      });
    });

    const promise = searchCountries('germany', new AbortController().signal, 10);

    await expect(promise).rejects.toMatchObject({ name: 'TimeoutError' });
  });
});
