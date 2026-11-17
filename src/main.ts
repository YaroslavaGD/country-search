import { createSearchController } from './core/searchController';
import { searchCountries } from './core/searchCountries';
import { createElement } from './ui/createElement';
import { renderCountryCard } from './ui/renderCountryCard';

const DEBOUNCE_MS = 300;

const searchInput = createElement('input');
const statusText = createElement('p');
const resultsList = createElement('div');
document.body.append(searchInput, statusText, resultsList);

const searchController = createSearchController({
  search: searchCountries,
  delay: DEBOUNCE_MS,
  onChange: (state) => {
    switch (state.status) {
      case 'empty':
        statusText.textContent = 'Nothing found';
        resultsList.replaceChildren();
        break;
      case 'idle':
      case 'error':
      case 'loading':
        statusText.textContent = state.status;
        resultsList.replaceChildren();
        break;
      case 'success':
        statusText.textContent = '';
        resultsList.replaceChildren(...state.countries.map(renderCountryCard));
        break;
    }
  },
});

searchInput.addEventListener('input', () => searchController.input(searchInput.value));
