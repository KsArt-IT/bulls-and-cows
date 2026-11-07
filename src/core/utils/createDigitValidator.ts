import { DIGITS } from '../constants.js';
import type { SupportedBase } from '../types.js';

export const createDigitValidator = (base: SupportedBase): ((char: string) => boolean) => {
  const allowed = new Set(DIGITS.slice(0, base));
  return (char) => allowed.has(char.toLowerCase());
};
