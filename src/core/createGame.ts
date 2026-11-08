import type { GameState, Settings } from './types.js';

export const createGame = (settings: Settings, now: number, _random = Math.random): GameState => ({
  settings,
  secret: [],
  history: [],
  status: 'playing',
  startedAt: 0,
  finishedAt: null,
});
