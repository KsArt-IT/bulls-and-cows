import { SUPPORTED_LENGTHS } from '../constants.js';
import type { SupportedBase, SupportedLength } from '../types.js';

export const availableLengths = (base: SupportedBase): readonly SupportedLength[] =>
  SUPPORTED_LENGTHS.filter((length) => length <= base);
