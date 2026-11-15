import { describe, it, expect } from 'vitest';
import germany from './fixtures/germany.json';
import antarctica from './fixtures/antarctica.json';
import { mapCountryResponse } from '../src/core/mapCountryResponse';

describe('mapCountryResponse', () => {
  it('returns only the card fields', () => {
    expect(mapCountryResponse(germany)).toEqual({
      name: 'Germany',
      flagUrl: 'https://flagcdn.com/de.svg',
      capital: 'Berlin',
      region: 'Europe',
      population: 83240525,
      languages: ['German'],
    });
  });

  it('maps languages to a list of names', () => {
    const result = mapCountryResponse(antarctica);

    expect(result.languages).toEqual(['English', 'Russian']);
  });

  it('returns null capital when the country has none', () => {
    const result = mapCountryResponse(antarctica);

    expect(result.capital).toBeNull();
  });

  it('returns an empty list when the country has no languages', () => {
    const result = mapCountryResponse({ ...germany, languages: [] });

    expect(result.languages).toEqual([]);
  });

  it('does not mutate the raw response', () => {
    const raw = structuredClone(germany);

    mapCountryResponse(raw);

    expect(raw).toEqual(germany);
  });
});
