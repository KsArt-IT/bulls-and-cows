import { SUPPORTED_BASES, SUPPORTED_LENGTHS } from '../core/constants.js';
import type { GameRecord } from '../core/types.js';
import { BASE_NAMES } from './baseNames.js';
import { element } from './dom.js';

const recordsGroup = (
  base: GameRecord['base'],
  length: GameRecord['length'],
  records: readonly GameRecord[],
): HTMLElement =>
  element('section', { className: 'records__group' }, [
    element('h3', { className: 'records__title', text: `${BASE_NAMES[base]} · ${length} digits` }),
    element(
      'ol',
      { className: 'records__list' },
      records.map(({ attempts, timeMs }) =>
        element('li', {
          className: 'records__item',
          text: `${attempts} attempts · ${Math.round(timeMs / 1000)} s`,
        }),
      ),
    ),
  ]);

export const recordsView = (records: readonly GameRecord[]): HTMLElement => {
  const groups = SUPPORTED_BASES.flatMap((base) =>
    SUPPORTED_LENGTHS.map((length) => ({
      base,
      length,
      items: records.filter((record) => record.base === base && record.length === length),
    })),
  )
    .filter(({ items }) => items.length > 0)
    .map(({ base, length, items }) => recordsGroup(base, length, items));

  return element('section', { className: 'records' }, [
    element('h2', { text: 'Leaderboard' }),
    ...(groups.length > 0 ? groups : [element('p', { text: 'No records yet' })]),
  ]);
};
