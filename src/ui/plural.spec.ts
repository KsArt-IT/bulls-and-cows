import { describe, expect, it } from 'vitest';
import { plural } from './plural.js';

describe('plural', () => {
  it('uses the singular form for 1', () => {
    expect(plural(1, 'attempt')).toBe('1 attempt');
  });

  it.each([0, 2, 5, 11, 100])('uses the plural form for %i', (count) => {
    expect(plural(count, 'attempt')).toBe(`${count} attempts`);
  });
});
