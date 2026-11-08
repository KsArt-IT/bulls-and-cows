import { addRecord } from '../core/addRecord.js';
import { SUPPORTED_BASES, SUPPORTED_LENGTHS } from '../core/constants.js';
import type { GameRecord } from '../core/types.js';

const STORAGE_KEY = 'bulls-and-cows-game:leaderboard:v1';

type RecordsStorage = Pick<Storage, 'getItem' | 'setItem'>;

const isGameRecord = (value: unknown): value is GameRecord => {
  if (typeof value !== 'object' || value === null) return false;
  const { length, base, attempts, timeMs } = value as Record<string, unknown>;
  return (
    SUPPORTED_LENGTHS.some((l) => l === length) &&
    SUPPORTED_BASES.some((b) => b === base) &&
    typeof length === 'number' &&
    typeof base === 'number' &&
    length <= base &&
    Number.isInteger(attempts) &&
    (attempts as number) > 0 &&
    typeof timeMs === 'number' &&
    Number.isFinite(timeMs) &&
    timeMs >= 0
  );
};

export const loadRecords = (storage: RecordsStorage = localStorage): readonly GameRecord[] => {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter(isGameRecord).reduce<readonly GameRecord[]>(addRecord, [])
      : [];
  } catch {
    return [];
  }
};

export const saveRecords = (
  records: readonly GameRecord[],
  storage: RecordsStorage = localStorage,
): void => {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // storage is full or unavailable (private mode) — the game still works without records
  }
};
