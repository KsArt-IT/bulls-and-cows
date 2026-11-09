import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluateGuess.js';

// [secret, guess, bulls, cows] — strings are split into digits
const CASES = [
  // base 2
  ['01', '01', 2, 0],
  ['01', '10', 0, 2],

  // all bulls / all cows / nothing
  ['1234', '1234', 4, 0],
  ['1234', '4321', 0, 4],
  ['0123', '1230', 0, 4],
  ['1234', '5678', 0, 0],

  // mixed
  ['1234', '1235', 3, 0],
  ['1234', '1243', 2, 2],
  ['0123', '0132', 2, 2],
  ['1234', '1342', 1, 3],
  ['1234', '1356', 1, 1],
  ['1234', '1567', 1, 0],
  ['1234', '5167', 0, 1],
  ['1234', '2156', 0, 2],
  ['1234', '2315', 0, 3],

  // base 8
  ['0167', '7610', 0, 4],
  ['0167', '0176', 2, 2],

  // length 6
  ['012345', '012345', 6, 0],
  ['012345', '543210', 0, 6],
  ['012345', '012354', 4, 2],
  ['012345', '6789ab', 0, 0],

  // hex, case-insensitive
  ['ab23', 'AB32', 2, 2],
  ['AB23', 'ab23', 4, 0],
  ['0f1e', 'E1F0', 0, 4],
  ['abcdef', 'ABCDEF', 6, 0],
] as const;

describe('evaluateGuess', () => {
  it.each(CASES)('secret %j, guess %j → %i bulls, %i cows', (secret, guess, bulls, cows) => {
    expect(evaluateGuess([...secret], [...guess])).toEqual({ bulls, cows });
  });

  it.each(CASES)('symmetric: secret %j, guess %j', (secret, guess) => {
    expect(evaluateGuess([...guess], [...secret])).toEqual(evaluateGuess([...secret], [...guess]));
  });

  it('does not mutate arguments', () => {
    const secret = Object.freeze([...'1234']);
    const guess = Object.freeze([...'4321']);
    expect(() => evaluateGuess(secret, guess)).not.toThrow();
    expect(secret).toEqual([...'1234']);
    expect(guess).toEqual([...'4321']);
  });
});
