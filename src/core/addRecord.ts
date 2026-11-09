import type { GameRecord } from './types.js';

const TOP_PER_GROUP = 3;

const groupKey = ({ base, length }: GameRecord): string => `${base}:${length}`;

const compare = (a: GameRecord, b: GameRecord): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const addRecord = (
  records: readonly GameRecord[],
  record: GameRecord,
): readonly GameRecord[] => {
  const sorted = [...records, record].sort(compare);

  return sorted.filter(
    (current, index) =>
      sorted.slice(0, index).filter((better) => groupKey(better) === groupKey(current)).length <
      TOP_PER_GROUP,
  );
};
