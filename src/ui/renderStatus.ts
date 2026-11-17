import { ErrorKind } from '../core/classifyError';
import { SearchState } from '../core/searchController';
import { createElement } from './createElement';

const ERROR_MESSAGES: Record<Exclude<ErrorKind, 'aborted'>, string> = {
  timeout: 'The server took too long to respond. Please try again.',
  http: 'The server returned an error. Please try again.',
  network: "Can't reach the server. Check your connection and try again.",
};

export function renderStatus(state: SearchState, onRetry: () => void): HTMLElement[] {
  switch (state.status) {
    case 'loading':
      return [createElement('span', { text: 'Searching…' })];

    case 'empty':
      return [createElement('span', { text: 'Nothing found. Try another name.' })];

    case 'error': {
      const retryButton = createElement('button', { className: 'button', text: 'Try again' });
      retryButton.addEventListener('click', onRetry);

      return [createElement('span', { text: ERROR_MESSAGES[state.kind] }), retryButton];
    }
    case 'idle':
    case 'success':
      return [];
  }
}
