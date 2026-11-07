import type { Settings, SupportedBase } from '../types.js';
import { availableLengths } from './availableLengths.js';

export const selectBase = (settings: Settings, base: SupportedBase): Settings => {
  const allowed = availableLengths(base);
  const length = allowed.includes(settings.length)
    ? settings.length
    : (allowed.at(-1) ?? settings.length);
  return { ...settings, base, length };
};
