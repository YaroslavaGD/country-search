import { SearchState } from '../core/searchController';
import { createElement } from './createElement';
import { renderCountryCard } from './renderCountryCard';
import { renderStatus } from './renderStatus';

interface SearchViewHandlers {
  onInput: (text: string) => void;
  onRetry: () => void;
}

export interface SearchView {
  element: HTMLElement;
  render: (state: SearchState) => void;
}

export function createSearchView({ onInput, onRetry }: SearchViewHandlers): SearchView {
  const searchInput = createElement('input', {
    className: 'search-input',
    attributes: { type: 'search', placeholder: 'Search a country', 'aria-label': 'Country name' },
  });

  const status = createElement('p', { className: 'status' });
  const results = createElement('div', { className: 'results' });

  searchInput.addEventListener('input', () => onInput(searchInput.value));

  return {
    element: createElement('main', {}, searchInput, status, results),
    render(state) {
      status.replaceChildren(...renderStatus(state, onRetry));
      results.replaceChildren(...(state.status === 'success' ? state.countries.map(renderCountryCard) : []));
    },
  };
}
