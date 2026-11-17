import type { Country } from '../core/types';
import { createElement } from './createElement';

export function renderCountryCard(country: Country): HTMLElement {
  const img = createElement('img', {
    attributes: { src: country.flagUrl, alt: `Flag of ${country.name}` },
  });

  const name = createElement('h2', { text: country.name });
  const population = createElement('p', { text: `Population: ${country.population.toLocaleString()}` });
  const capital = createElement('p', { text: `Capital: ${country.capital ?? '---'}` });
  const region = createElement('p', { text: `Region: ${country.region}` });
  const languages = createElement('p', { text: `Languages: ${country.languages.join(', ')}` });

  return createElement('article', { className: 'card' }, img, name, capital, region, population, languages);
}
