import type { SUPPORTED_BASES, SUPPORTED_LENGTHS } from './constants.js';

export type SupportedBase = (typeof SUPPORTED_BASES)[number];
export type SupportedLength = (typeof SUPPORTED_LENGTHS)[number];

export type Secret = readonly string[];
export type GuessResult = { readonly bulls: number; readonly cows: number };

export type Settings = { readonly length: SupportedLength; readonly base: SupportedBase };

export type Attempt = { readonly guess: Secret; readonly result: GuessResult };

export type GameState = {
  readonly settings: Settings;
  readonly secret: Secret;
  readonly history: readonly Attempt[];
  readonly status: 'playing' | 'won';
  readonly startedAt: number;
  readonly finishedAt: number | null;
};
