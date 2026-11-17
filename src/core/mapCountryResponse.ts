import type { Country, CountryResponse } from './types';

export function mapCountryResponse(raw: CountryResponse): Country {
  const { name, region, population, capital, flags, languages, area, borders, currencies } = raw;
  return {
    name,
    region,
    population,
    capital: capital ?? null,
    flagUrl: flags.svg,
    languages: languages.map((language) => language.name),
    area,
    borders: borders ?? [],
    currencies: (currencies ?? []).map((currency) => currency.name),
  };
}
