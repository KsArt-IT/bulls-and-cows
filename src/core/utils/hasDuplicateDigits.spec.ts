import { describe, expect, it } from 'vitest';
import { hasDuplicateDigits } from './hasDuplicateDigits.js';

describe('hasDuplicateDigits', () => {
  it.each(['', '1', '1234', '0123', 'abcdef'])('%j has no duplicates', (guess) => {
    expect(hasDuplicateDigits(guess)).toBe(false);
  });

  it.each(['11', '1231', '0120', 'abca'])('%j has duplicates', (guess) => {
    expect(hasDuplicateDigits(guess)).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(hasDuplicateDigits('aA')).toBe(true);
    expect(hasDuplicateDigits('AbCd')).toBe(false);
  });
});
