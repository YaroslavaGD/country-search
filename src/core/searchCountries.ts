import { HttpError } from './errors';
import { mapCountryResponse } from './mapCountryResponse';
import type { Country, CountryResponse } from './types';

const API_URL = 'https://countries.dev/name/';

export async function searchCountries(query: string, signal: AbortSignal): Promise<Country[]> {
  const response = await fetch(`${API_URL}${encodeURIComponent(query)}`, { signal });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status, `Http error: ${response.statusText}`);
  }

  const body: CountryResponse[] = await response.json();

  return body.map(mapCountryResponse);
}
