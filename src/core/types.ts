export const SUPPORTED_BASES = [2, 8, 10, 16] as const;
export type SupportedBase = (typeof SUPPORTED_BASES)[number];
