import type { Country } from '../core/types';
import { createElement } from './createElement';

function renderList(list: readonly string[]): string {
  if (list.length === 0) {
    return '---';
  }

  return list.join(', ');
}

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

  const area = createElement('p', { className: 'card__text', text: `Area: ${country.area}` });
  const borders = createElement('p', { className: 'card__text', text: `Borders: ${renderList(country.borders)}` });
  const languages = createElement('p', {
    className: 'card__text',
    text: `Languages: ${renderList(country.languages)}`,
  });
  const currencies = createElement('p', {
    className: 'card__text',
    text: `Currencies: ${renderList(country.currencies)}`,
  });

  const summary = createElement('summary', { className: 'card__summary', text: 'More' });
  const details = createElement(
    'details',
    { className: 'card__details' },
    summary,
    area,
    borders,
    languages,
    currencies,
  );

  return createElement('article', { className: 'card' }, img, name, capital, region, population, details);
}
