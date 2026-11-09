import { describe, expect, it } from 'vitest';
import { availableLengths } from './availableLengths.js';

describe('availableLengths', () => {
  it.each([
    [2, [2]],
    [8, [2, 3, 4, 5, 6]],
    [16, [2, 3, 4, 5, 6]],
  ] as const)('base %i → %j', (base, expected) => {
    expect(availableLengths(base)).toEqual(expected);
  });
});
