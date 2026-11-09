import type { GameState, Secret } from './types.js';
import { evaluateGuess } from './utils/evaluateGuess.js';

const guessKey = (guess: Secret): string => guess.join('').toLowerCase();

export const makeGuess = (state: GameState, guess: Secret, now: number): GameState => {
  const key = guessKey(guess);
  if (state.status === 'won' || state.history.some((attempt) => guessKey(attempt.guess) === key)) {
    return state;
  }

  const result = evaluateGuess(state.secret, guess);
  const isWon = result.bulls === state.settings.length;

  return {
    ...state,
    history: [...state.history, { guess, result }],
    status: isWon ? 'won' : 'playing',
    finishedAt: isWon ? now : null,
  };
};
