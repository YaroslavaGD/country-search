import type { Country } from '../core/types';
import { createElement } from './createElement';

export function renderCountryCard(country: Country): HTMLElement {
  const img = createElement('img', {
    className: 'card__img',
    attributes: { src: country.flagUrl, alt: `Flag of ${country.name}` },
  });

  const name = createElement('h2', { className: 'card__name', text: country.name });
  const population = createElement('p', {
    className: 'card__text',
    text: `Population: ${country.population.toLocaleString()}`,
  });
  const capital = createElement('p', { className: 'card__text', text: `Capital: ${country.capital ?? '---'}` });
  const region = createElement('p', { className: 'card__text', text: `Region: ${country.region}` });

  return createElement('article', { className: 'card' }, img, name, capital, region, population);
}
