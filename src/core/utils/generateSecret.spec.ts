import { afterEach, describe, expect, it, vi } from 'vitest';
import { SUPPORTED_BASES } from '../constants.js';
import { countPossibleSecrets } from './countPossibleSecrets.js';
import { generateSecret } from './generateSecret.js';
import { isValidGuess } from './isValidGuess.js';

const RUNS = 200;

// deterministic pseudo-random generator (LCG) → [0, 1)
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 2 ** 32;
  return seed / 2 ** 32;
};

// returns given values in order, throws when they run out —
// a "retry until unique" implementation fails instead of hanging
const sequence =
  (...values: number[]) =>
  () => {
    const value = values.shift();
    if (value === undefined) throw new Error('random called more times than expected');
    return value;
  };

const COMBOS = SUPPORTED_BASES.flatMap((base) =>
  [2, 3, 4, 5, 6].filter((length) => length <= base).map((length) => [length, base] as const),
);

describe('generateSecret', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exact values with deterministic random', () => {
    it.each([
      // [length, base, random values, expected]
      [2, 2, [0, 0], '01'],
      [2, 2, [0.999, 0], '10'],
      [4, 10, [0, 0, 0, 0], '0123'],
      [4, 10, [0.999, 0.999, 0.999, 0.999], '9876'],
      [4, 10, [0.5, 0, 0, 0], '5012'],
      [2, 16, [0.999, 0.999], 'fe'],
    ] as const)('length %i, base %i, random %j → %s', (length, base, values, expected) => {
      expect(generateSecret(length, base, sequence(...values))).toEqual([...expected]);
    });
  });

  describe.each(COMBOS)('length %i, base %i', (length, base) => {
    it('returns a valid secret: right length, digits of base, no repeats', () => {
      const random = seeded(length * 100 + base);
      for (let i = 0; i < RUNS; i++) {
        const secret = generateSecret(length, base, random);
        expect(secret).toHaveLength(length);
        expect(isValidGuess(secret.join(''), length, base)).toBe(true);
      }
    });

    it('every element is a single lowercase char', () => {
      const secret = generateSecret(length, base, seeded(length * 100 + base));
      for (const digit of secret) {
        expect(digit).toHaveLength(1);
        expect(digit).toBe(digit.toLowerCase());
      }
    });
  });

  describe('random boundaries', () => {
    it.each([
      ['0', 0],
      ['almost 1', 0.9999999999],
    ])('stays in range when random always returns %s', (_name, value) => {
      for (const [length, base] of COMBOS) {
        const random = sequence(...Array<number>(length).fill(value));
        expect(isValidGuess(generateSecret(length, base, random).join(''), length, base)).toBe(
          true,
        );
      }
    });
  });

  describe('randomness', () => {
    it('calls random exactly length times', () => {
      const random = vi.fn(seeded(1));
      generateSecret(6, 10, random);
      expect(random).toHaveBeenCalledTimes(6);
    });

    it('uses the injected random instead of Math.random', () => {
      const mathRandom = vi.spyOn(Math, 'random');
      const random = vi.fn(seeded(1));
      generateSecret(4, 10, random);
      expect(random).toHaveBeenCalled();
      expect(mathRandom).not.toHaveBeenCalled();
    });

    it('uses Math.random by default', () => {
      const mathRandom = vi.spyOn(Math, 'random');
      generateSecret(4, 10);
      expect(mathRandom).toHaveBeenCalled();
    });

    it('is deterministic for the same random sequence', () => {
      expect(generateSecret(6, 16, seeded(42))).toEqual(generateSecret(6, 16, seeded(42)));
    });

    it('allows a leading zero', () => {
      const random = seeded(7);
      const results = Array.from({ length: 500 }, () => generateSecret(4, 10, random));
      expect(results.some((secret) => secret[0] === '0')).toBe(true);
    });

    it.each([
      [2, 2],
      [2, 8],
    ] as const)('produces every possible secret for length %i, base %i', (length, base) => {
      const random = seeded(3);
      const seen = new Set<string>();
      for (let i = 0; i < 3000; i++) seen.add(generateSecret(length, base, random).join(''));
      expect(seen.size).toBe(countPossibleSecrets(length, base));
    });

    it('uses every digit of base 16', () => {
      const random = seeded(5);
      const seen = new Set<string>();
      for (let i = 0; i < 500; i++) generateSecret(2, 16, random).forEach((d) => seen.add(d));
      expect([...seen].sort().join('')).toBe('0123456789abcdef');
    });
  });
});
