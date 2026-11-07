import { DIGITS } from '../constants.js';
import type { Secret, SupportedBase } from '../types.js';

type State = { readonly pool: readonly string[]; readonly secret: readonly string[] };

export const generateSecret = (length: number, base: SupportedBase, random = Math.random): Secret =>
  Array.from({ length }).reduce<State>(
    ({ pool, secret }) => {
      const index = Math.floor(random() * pool.length);
      return {
        pool: pool.filter((_, i) => i !== index),
        secret: [...secret, pool[index]],
      };
    },
    { pool: [...DIGITS.slice(0, base)], secret: [] },
  ).secret;
