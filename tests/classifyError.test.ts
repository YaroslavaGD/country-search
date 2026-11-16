import { describe, it, expect } from 'vitest';
import { classifyError } from '../src/core/classifyError';
import { HttpError } from '../src/core/errors';

describe('classifyError', () => {
  it.each([
    ['AbortError', new DOMException('aborted', 'AbortError'), 'aborted'],
    ['TimeoutError', new DOMException('time out', 'TimeoutError'), 'timeout'],
    ['HttpError', new HttpError(500, 'Server error'), 'http'],
    ['TypeError', new TypeError('Failed to fetch'), 'network'],
  ])('classifies %s', (_label, error, expected) => {
    expect(classifyError(error)).toBe(expected);
  });
});
