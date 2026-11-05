import type { SupportedBase } from '../types.js';

export const createDigitValidator = (_base: SupportedBase): ((char: string) => boolean) => {
  return () => false;
};
