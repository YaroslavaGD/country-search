export type ErrorKind = 'aborted' | 'timeout' | 'http' | 'network';

export function classifyError(_error: unknown): ErrorKind {
  throw new Error('Not implemented');
}
