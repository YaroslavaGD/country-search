import { HttpError } from './errors';

export type ErrorKind = 'aborted' | 'timeout' | 'http' | 'network';

export function classifyError(error: unknown): ErrorKind {
  if (error instanceof HttpError) {
    return 'http';
  }

  if (error instanceof Error) {
    switch (error.name) {
      case 'AbortError':
        return 'aborted';
      case 'TimeoutError':
        return 'timeout';
    }
  }

  return 'network';
}
