import type { SupportedBase } from '../types.js';
import { createDigitValidator } from './createDigitValidator.js';
import { hasDuplicateDigits } from './hasDuplicateDigits.js';

export const isValidGuess = (guess: string, length: number, base: SupportedBase): boolean => {
  const isDigit = createDigitValidator(base);
  const chars = [...guess.toLowerCase()];
  return chars.length === length && chars.every(isDigit) && !hasDuplicateDigits(guess);
};
