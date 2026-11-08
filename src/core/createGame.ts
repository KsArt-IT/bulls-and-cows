import type { GameState, Settings } from './types.js';
import { generateSecret } from './utils/generateSecret.js';

export const createGame = (settings: Settings, now: number, random = Math.random): GameState => ({
  settings,
  secret: generateSecret(settings.length, settings.base, random),
  history: [],
  status: 'playing',
  startedAt: now,
  finishedAt: null,
});
