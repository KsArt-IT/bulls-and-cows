import { describe, expect, it } from 'vitest';
import { makeGuess } from './makeGuess.js';
import type { GameState } from './types.js';

const base = Object.freeze<GameState>({
  settings: { length: 4, base: 10 },
  secret: ['1', '2', '3', '4'],
  history: [],
  status: 'playing',
  startedAt: 1000,
  finishedAt: null,
});

describe('makeGuess', () => {
  describe('default state (playing, empty history), wrong guess', () => {
    const guess = ['1', '2', '4', '5'];
    const next = makeGuess(base, guess, 2000);

    it('appends the attempt with bulls and cows to history', () => {
      expect(next.history).toEqual([{ guess, result: { bulls: 2, cows: 1 } }]);
    });

    it('keeps the game in progress', () => {
      expect(next.status).toBe('playing');
      expect(next.finishedAt).toBeNull();
    });

    it('keeps settings, secret and startedAt unchanged', () => {
      expect(next.settings).toEqual(base.settings);
      expect(next.secret).toEqual(base.secret);
      expect(next.startedAt).toBe(base.startedAt);
    });

    it('does not mutate the previous state', () => {
      expect(base.history).toEqual([]);
      expect(next).not.toBe(base);
    });
  });

  describe('repeated guess', () => {
    const once = makeGuess(base, ['1', '2', '4', '5'], 2000);

    it('returns the same state for the same guess', () => {
      expect(makeGuess(once, ['1', '2', '4', '5'], 3000)).toBe(once);
    });

    it('treats a hex guess with a different case as a repeat', () => {
      const hex = Object.freeze<GameState>({
        ...base,
        settings: { length: 4, base: 16 },
        secret: ['a', 'b', '1', '2'],
      });
      const first = makeGuess(hex, ['a', 'b', '2', '1'], 2000);

      expect(makeGuess(first, ['A', 'B', '2', '1'], 3000)).toBe(first);
    });
  });

  describe('winning guess', () => {
    const won = makeGuess(base, ['1', '2', '3', '4'], 5000);

    it('finishes the game', () => {
      expect(won.status).toBe('won');
      expect(won.finishedAt).toBe(5000);
      expect(won.history).toHaveLength(1);
    });

    it('ignores guesses after the win', () => {
      expect(makeGuess(won, ['5', '6', '7', '8'], 6000)).toBe(won);
    });
  });
});
