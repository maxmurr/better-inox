import { describe, expect, it } from 'vitest';

import { initials } from '@/app/_components/user-avatar';

describe('initials', () => {
  it.each([
    ['maxmurr', 'MA'],
    ['Aisha Khan', 'AK'],
    ['user', 'US'],
    ['userjo', 'JO'],
    ['userjo2', 'JO'],
    ['usera', 'A'],
    ['usera57', 'A'],
    ['kittiphongjaroenwattanakua1b2c3', 'KI'],
  ])('%s -> %s', (username, expected) => {
    expect(initials(username)).toBe(expected);
  });
});
