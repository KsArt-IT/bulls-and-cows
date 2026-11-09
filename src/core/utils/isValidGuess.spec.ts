import { describe, expect, it } from 'vitest';
import { isValidGuess } from './isValidGuess.js';

describe('isValidGuess', () => {
  it.each([
    // [guess, length, base, expected]
    ['01', 2, 2, true],
    ['10', 2, 2, true],

    ['07', 2, 8, true],
    ['1237', 4, 8, true],
    ['012345', 6, 8, true],

    ['1234', 4, 10, true],
    ['0123', 4, 10, true],
    ['012345', 6, 10, true],

    ['af', 2, 16, true],
    ['Ab', 2, 16, true],
    ['ABCD', 4, 16, true],
    ['012a', 4, 16, true],
    ['01F9', 4, 16, true],
    ['0123f5', 6, 16, true],
  ] as const)('valid: %j, length %i, base %i → %s', (guess, length, base, expected) =>
    expect(isValidGuess(guess, length, base)).toBe(expected),
  );

  it.each([
    // wrong length
    ['0', 2, 2, false],
    ['010', 2, 2, false],
    ['123', 4, 10, false],
    ['12345', 4, 10, false],
    ['', 4, 10, false],

    // digit outside base
    ['12', 2, 2, false],
    ['1238', 4, 8, false],
    ['12a4', 4, 10, false],
    ['aG12', 4, 16, false],
    ['0x1f', 4, 16, false],

    // duplicates
    ['00', 2, 2, false],
    ['1771', 4, 8, false],
    ['1123', 4, 10, false],
    ['1231', 4, 10, false],
    ['aA12', 4, 16, false],
    ['0123Ff', 6, 16, false],

    // whitespace (no trimming)
    ['    ', 4, 10, false],
    [' 123', 4, 10, false],
    ['123 ', 4, 10, false],
    ['12 3', 4, 10, false],
    ['12\t3', 4, 10, false],
    ['123\n', 4, 10, false],

    // number-like strings
    ['-123', 4, 10, false],
    ['+123', 4, 10, false],
    ['1.23', 4, 10, false],
    ['1e3', 3, 10, false],

    // non-ASCII digits
    ['１２３４', 4, 10, false],
    ['١٢٣٤', 4, 10, false],
  ] as const)('invalid: %j, length %i, base %i → %s', (guess, length, base, expected) =>
    expect(isValidGuess(guess, length, base)).toBe(expected),
  );
});
