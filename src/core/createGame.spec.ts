import { describe, expect, it } from 'vitest';
import { createGame } from './createGame.js';
import { isValidGuess } from './utils/isValidGuess.js';

describe('createGame', () => {
  it('creates a new game in progress', () => {
    const game = createGame({ length: 4, base: 10 }, 1000, () => 0);

    expect(game).toEqual({
      settings: { length: 4, base: 10 },
      secret: ['0', '1', '2', '3'],
      history: [],
      status: 'playing',
      startedAt: 1000,
      finishedAt: null,
    });
  });

  it('uses the settings for the secret', () => {
    const game = createGame({ length: 2, base: 16 }, 0, () => 0.999);
    expect(game.secret).toEqual(['f', 'e']);
  });

  it('generates a valid secret with the requested length', () => {
    const settings = { length: 6, base: 16 } as const;
    const { secret } = createGame(settings, 0);

    expect(isValidGuess(secret.join(''), settings.length, settings.base)).toBe(true);
  });

  it('takes the start time from the argument', () => {
    expect(createGame({ length: 3, base: 8 }, 42, () => 0).startedAt).toBe(42);
  });

  it('keeps the passed settings as they are', () => {
    const settings = { length: 5, base: 10 } as const;
    expect(createGame(settings, 0, () => 0).settings).toBe(settings);
  });

  it('returns independent states on each call', () => {
    const settings = { length: 4, base: 10 } as const;
    const a = createGame(settings, 0, () => 0);
    const b = createGame(settings, 0, () => 0);

    expect(a).toEqual(b);
    expect(a.history).not.toBe(b.history);
  });
});
