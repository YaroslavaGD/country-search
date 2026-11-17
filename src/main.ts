import { createSearchController } from './core/searchController';
import { searchCountries } from './core/searchCountries';

const DEBOUNCE_MS = 300;

const searchInput = document.createElement('input');
const statusText = document.createElement('p');

document.body.append(searchInput, statusText);

const searchController = createSearchController({
  search: searchCountries,
  delay: DEBOUNCE_MS,
  onChange: (state) => {
    statusText.textContent = state.status;
  },
});

searchInput.addEventListener('input', () => searchController.input(searchInput.value));
