import { describe, expect, it } from 'vitest';
import { SUPPORTED_BASES } from '../constants.js';
import type { SupportedBase } from '../types.js';
import { createDigitValidator } from './createDigitValidator.js';

const VALID: Record<SupportedBase, string[]> = {
  2: [...'01'],
  8: [...'01234567'],
  10: [...'0123456789'],
  16: [...'0123456789abcdefABCDEF'],
};

const INVALID: Record<SupportedBase, string[]> = {
  2: ['2', '9', 'a', '01', '-'],
  8: ['8', '9', 'a', '00', '-'],
  10: ['/', ':', 'a', 'A', '12', '-', '１', '٣'],
  16: ['/', ':', '@', '`', 'g', 'G', 'ab', 'AB', '-', 'ａ'],
};

// common for every base
const ALWAYS_INVALID = ['', ' ', '\t', '\n'];

describe('createDigitValidator', () => {
  describe.each(SUPPORTED_BASES)('base %i', (base) => {
    const isDigit = createDigitValidator(base);

    it.each(VALID[base])('valid: %j → true', (char) => {
      expect(isDigit(char)).toBe(true);
    });

    it.each([...INVALID[base], ...ALWAYS_INVALID])('invalid: %j → false', (char) => {
      expect(isDigit(char)).toBe(false);
    });
  });
});
