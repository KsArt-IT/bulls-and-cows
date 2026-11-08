import type { GameRecord, GameState } from './types.js';

export const toRecord = ({
  settings,
  history,
  startedAt,
  finishedAt,
}: GameState): GameRecord | null =>
  finishedAt === null
    ? null
    : { ...settings, attempts: history.length, timeMs: finishedAt - startedAt };
