import './style.css';
import { createSearchController } from './core/searchController';
import { searchCountries } from './core/searchCountries';
import { createSearchView } from './ui/createSearchView';

const DEBOUNCE_MS = 300;

const view = createSearchView({
  onInput: (text) => searchController.input(text),
  onRetry: () => searchController.retry(),
});

const searchController = createSearchController({
  search: searchCountries,
  delay: DEBOUNCE_MS,
  onChange: view.render,
});

document.body.append(view.element);
