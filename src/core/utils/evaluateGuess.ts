import type { Secret, GuessResult } from '../types.js';

export const evaluateGuess = (_secret: Secret, _guess: Secret): GuessResult => {
  return { bulls: 0, cows: 0 };
};
