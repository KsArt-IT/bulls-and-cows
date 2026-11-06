export const SUPPORTED_BASES = [2, 8, 10, 16] as const;
export type SupportedBase = (typeof SUPPORTED_BASES)[number];

export type Secret = readonly string[];
export type GuessResult = { readonly bulls: number; readonly cows: number };
