import { describe, expect, it } from 'vitest';
import { selectBase } from './selectBase.js';

describe('selectBase', () => {
  it('changes the base and keeps the length when it is allowed', () => {
    expect(selectBase({ length: 4, base: 10 }, 16)).toEqual({ length: 4, base: 16 });
  });

  it('clamps the length to the largest allowed one for the new base', () => {
    expect(selectBase({ length: 4, base: 10 }, 2)).toEqual({ length: 2, base: 2 });
  });

  it('keeps the length when switching back from bin', () => {
    expect(selectBase({ length: 2, base: 2 }, 10)).toEqual({ length: 2, base: 10 });
  });
});
