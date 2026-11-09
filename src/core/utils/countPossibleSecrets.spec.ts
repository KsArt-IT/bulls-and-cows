import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './countPossibleSecrets.js';

// P(base, length) = base! / (base - length)!
describe('countPossibleSecrets', () => {
  it.each([
    // [length, base, expected]
    [2, 2, 2],

    [2, 8, 56],
    [3, 8, 336],
    [4, 8, 1680],
    [5, 8, 6720],
    [6, 8, 20160],

    [2, 10, 90],
    [3, 10, 720],
    [4, 10, 5040],
    [5, 10, 30240],
    [6, 10, 151200],

    [2, 16, 240],
    [3, 16, 3360],
    [4, 16, 43680],
    [5, 16, 524160],
    [6, 16, 5765760],
  ] as const)('length %i, base %i → %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  describe('edge cases', () => {
    it.each([
      // recursion base: one way to pick nothing
      [0, 10, 1],
      [1, 2, 2],
      [1, 10, 10],
      [1, 16, 16],
      // all digits used: base!
      [8, 8, 40320],
      [10, 10, 3628800],
      // more digits than base allows → impossible
      [3, 2, 0],
      [9, 8, 0],
    ] as const)('length %i, base %i → %i', (length, base, expected) => {
      expect(countPossibleSecrets(length, base)).toBe(expected);
    });
  });

  it('leading zero is allowed: base 2 length 2 → "01" and "10"', () => {
    expect(countPossibleSecrets(2, 2)).toBe(2);
  });

  it('returns the same result on repeated calls (memoized)', () => {
    const first = countPossibleSecrets(6, 16);
    expect(countPossibleSecrets(6, 16)).toBe(first);
    expect(countPossibleSecrets(6, 16)).toBe(first);
  });

  it('memo does not mix up different arguments', () => {
    expect(countPossibleSecrets(4, 10)).toBe(5040);
    expect(countPossibleSecrets(4, 16)).toBe(43680);
    expect(countPossibleSecrets(4, 8)).toBe(1680);
    expect(countPossibleSecrets(4, 10)).toBe(5040);
  });
});
