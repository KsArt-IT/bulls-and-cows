import { describe, expect, it } from 'vitest';
import { loadRecords, saveRecords } from './storage.js';
import type { GameRecord } from '../core/types.js';

const KEY = 'bulls-and-cows-game:leaderboard:v1';

type FakeStorage = Pick<Storage, 'getItem' | 'setItem'>;

const fakeStorage = (initial?: string): FakeStorage => {
  const data = new Map<string, string>(initial === undefined ? [] : [[KEY, initial]]);
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
};

const record: GameRecord = { length: 4, base: 10, attempts: 5, timeMs: 12_000 };

describe('storage', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadRecords(fakeStorage())).toEqual([]);
  });

  it('round-trips saved records', () => {
    const storage = fakeStorage();
    saveRecords([record], storage);

    expect(loadRecords(storage)).toEqual([record]);
  });

  it.each(['not json', '{}', '"str"', 'null', '42'])('ignores corrupted data %j', (raw) => {
    expect(loadRecords(fakeStorage(raw))).toEqual([]);
  });

  it('drops invalid entries and keeps valid ones', () => {
    const raw = JSON.stringify([
      record,
      null,
      { ...record, length: 7 },
      { ...record, base: 3 },
      { length: 6, base: 2, attempts: 1, timeMs: 1 },
      { ...record, attempts: 0 },
      { ...record, attempts: 2.5 },
      { ...record, attempts: '5' },
      { ...record, timeMs: -1 },
    ]);

    expect(loadRecords(fakeStorage(raw))).toEqual([record]);
  });

  it('normalizes stored records: sorted, top 3 per group', () => {
    const make = (attempts: number, base = 10): GameRecord => ({
      ...record,
      base: base as GameRecord['base'],
      attempts,
    });
    const raw = JSON.stringify([make(9), make(2), make(7), make(5), make(3, 16)]);

    expect(loadRecords(fakeStorage(raw))).toEqual([make(2), make(3, 16), make(5), make(7)]);
  });

  it('does not throw when the storage is unavailable', () => {
    const broken = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('quota');
      },
    };

    expect(loadRecords(broken)).toEqual([]);
    expect(() => saveRecords([record], broken)).not.toThrow();
  });
});
