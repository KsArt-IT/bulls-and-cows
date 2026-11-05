import type { SupportedBase } from '../types.js';

const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: SupportedBase): ((char: string) => boolean) => {
  const allowed = new Set(DIGITS.slice(0, base));
  return (char) => allowed.has(char.toLowerCase());
};
