import { HttpError } from './errors';
import { mapCountryResponse } from './mapCountryResponse';
import type { Country, CountryResponse } from './types';

const API_URL = 'https://countries.dev/name/';
const REQUEST_TIMEOUT_MS = 10000;

export async function searchCountries(
  query: string,
  signal: AbortSignal,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Country[]> {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = AbortSignal.any([signal, timeoutSignal]);

  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, { signal: combinedSignal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  const body: CountryResponse[] = await response.json();

  return body.map(mapCountryResponse);
}
