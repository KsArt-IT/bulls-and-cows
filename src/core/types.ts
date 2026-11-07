import { SUPPORTED_BASES } from './constants.js';

export type SupportedBase = (typeof SUPPORTED_BASES)[number];

export type Secret = readonly string[];
export type GuessResult = { readonly bulls: number; readonly cows: number };
