import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('returns the result of the original function on every call', () => {
    const memoized = memoize((a: number, b: number) => a + b);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
  });

  it('calls the original function once for the same arguments', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(spy);
    memoized(1, 2);
    memoized(1, 2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not collide keys of different arguments', () => {
    const spy = vi.fn((...args: unknown[]) => args.join('|'));
    const memoized = memoize(spy);
    expect(memoized(1, 23)).toBe('1|23');
    expect(memoized(12, 3)).toBe('12|3');
    expect(memoized(4, 10)).toBe('4|10');
    expect(memoized(10, 4)).toBe('10|4');
    expect(memoized('1')).toBe('1');
    expect(memoized(1)).toBe('1');
    expect(spy).toHaveBeenCalledTimes(6);
  });

  it.each([0, undefined])('caches falsy result %s', (value) => {
    const spy = vi.fn(() => value);
    const memoized = memoize(spy);
    expect(memoized()).toBe(value);
    expect(memoized()).toBe(value);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('keeps separate caches for separate memoized functions', () => {
    const spy = vi.fn((n: number) => n * 2);
    memoize(spy)(5);
    memoize(spy)(5);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('memoizes recursive calls: fib(20) computes each n once', () => {
    const spy = vi.fn((n: number): number => (n < 2 ? n : fib(n - 1) + fib(n - 2)));
    const fib = memoize(spy);
    expect(fib(20)).toBe(6765);
    expect(spy).toHaveBeenCalledTimes(21);
  });
});
