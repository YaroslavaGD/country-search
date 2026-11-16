import { classifyError, type ErrorKind } from './classifyError';
import { debounce } from './debounce';
import type { Country } from './types';

export type SearchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; countries: Country[] }
  | { status: 'empty' }
  | { status: 'error'; kind: Exclude<ErrorKind, 'aborted'> };

export interface SearchControllerOptions {
  search: (query: string, signal: AbortSignal) => Promise<Country[]>;
  delay: number;
  onChange: (state: SearchState) => void;
}

export interface SearchController {
  input(text: string): void;
  retry(): void;
}

export function createSearchController(options: SearchControllerOptions): SearchController {
  let lastInput = '';
  let currentAbortController: AbortController | null = null;

  const startSearch = (query: string) => {
    if (query === '') {
      return;
    }

    currentAbortController = new AbortController();
    options.onChange({ status: 'loading' });

    options
      .search(query, currentAbortController.signal)
      .then((countries) => {
        const state: SearchState = countries.length ? { status: 'success', countries } : { status: 'empty' };
        options.onChange(state);
      })
      .catch((error: unknown) => {
        const errorKind = classifyError(error);
        if (errorKind !== 'aborted') {
          options.onChange({ status: 'error', kind: errorKind });
        }
      });
  };

  const debounceSearch = debounce(startSearch, options.delay);

  return {
    input(text: string) {
      if (text === '') {
        options.onChange({ status: 'idle' });
      }

      lastInput = text;

      if (currentAbortController !== null) {
        currentAbortController.abort();
      }
      debounceSearch(text);
    },
    retry() {
      startSearch(lastInput);
    },
  };
}
