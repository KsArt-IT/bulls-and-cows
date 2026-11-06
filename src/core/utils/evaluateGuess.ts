import type { GuessResult, Secret } from '../types.js';

const normalize = (digits: Secret): string[] => digits.map((digit) => digit.toLowerCase());

export const evaluateGuess = (secret: Secret, guess: Secret): GuessResult => {
  const secretDigits = normalize(secret);
  const guessDigits = normalize(guess);
  const secretSet = new Set(secretDigits);

  const bulls = guessDigits.filter((digit, i) => digit === secretDigits[i]).length;
  const matches = guessDigits.filter((digit) => secretSet.has(digit)).length;

  return { bulls, cows: matches - bulls };
};
