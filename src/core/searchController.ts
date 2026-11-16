import type { ErrorKind } from './classifyError';
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

export function createSearchController(_options: SearchControllerOptions): SearchController {
  throw new Error('not implemented');
}
