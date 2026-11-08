import { describe, expect, it } from 'vitest';
import { addRecord } from './addRecord.js';
import type { GameRecord } from './types.js';

const rec = (attempts: number, timeMs: number, base = 10, length = 4): GameRecord => ({
  base: base as GameRecord['base'],
  length: length as GameRecord['length'],
  attempts,
  timeMs,
});

describe('addRecord', () => {
  it('adds a record to an empty list', () => {
    const record = rec(5, 10_000);
    expect(addRecord([], record)).toEqual([record]);
  });

  it('sorts a group by attempts, then by time', () => {
    const a = rec(7, 5_000);
    const b = rec(5, 9_000);
    const c = rec(5, 4_000);

    expect(addRecord([a, b], c)).toEqual([c, b, a]);
  });

  it('puts the record with less time higher when attempts are equal', () => {
    const slow = rec(6, 20_000);
    const fast = rec(6, 10_000);

    expect(addRecord([slow], fast)).toEqual([fast, slow]);
  });

  it('keeps only the 3 best records in a group', () => {
    const r1 = rec(3, 1_000);
    const r2 = rec(5, 1_000);
    const r3 = rec(8, 1_000);
    const better = rec(4, 1_000);

    const result = addRecord([r1, r2, r3], better);

    expect(result).toEqual([r1, better, r2]);
    expect(result).toHaveLength(3);
  });

  it('drops a new record that is worse than all three', () => {
    const r1 = rec(3, 1_000);
    const r2 = rec(4, 1_000);
    const r3 = rec(5, 1_000);

    expect(addRecord([r1, r2, r3], rec(9, 1_000))).toEqual([r1, r2, r3]);
  });

  it('does not let a record of another group push out foreign records', () => {
    const dec = [rec(3, 1_000), rec(4, 1_000), rec(5, 1_000)];
    const hex = rec(9, 9_000, 16, 4);

    const result = addRecord(dec, hex);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([...dec, hex]));
  });

  it('treats the same base with another length as another group', () => {
    const four = [rec(3, 1_000), rec(4, 1_000), rec(5, 1_000)];
    const six = rec(9, 9_000, 10, 6);

    expect(addRecord(four, six)).toHaveLength(4);
  });

  it('does not mutate the source array', () => {
    const records = Object.freeze([rec(3, 1_000), rec(4, 1_000)]);
    const result = addRecord(records, rec(2, 1_000));

    expect(records).toEqual([rec(3, 1_000), rec(4, 1_000)]);
    expect(result).not.toBe(records);
  });
});
