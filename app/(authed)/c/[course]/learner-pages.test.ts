import { describe, expect, it } from 'vitest';

import {
  LEARNERS_PAGE_SIZE,
  learnersPage,
  parseLearnersPage,
} from '@/app/(authed)/c/[course]/learner-pages';

const learners = Array.from({ length: 1284 }, (_, index) => index);

describe('parseLearnersPage', () => {
  it.each([
    [undefined, 1],
    ['', 1],
    ['0', 1],
    ['-2', 1],
    ['1.5', 1],
    ['abc', 1],
    [['2', '3'], 1],
    ['7', 7],
  ])('reads %j as page %i', (value, page) => {
    expect(parseLearnersPage(value)).toBe(page);
  });
});

describe('learnersPage', () => {
  it('returns one page of learners starting at the page offset', () => {
    const result = learnersPage(learners, 2);

    expect(result.learners).toHaveLength(LEARNERS_PAGE_SIZE);
    expect(result.learners[0]).toBe(LEARNERS_PAGE_SIZE);
    expect(result.pageCount).toBe(26);
  });

  it('returns the partial last page and clamps pages past the end to it', () => {
    const result = learnersPage(learners, 99);

    expect(result.page).toBe(26);
    expect(result.learners).toHaveLength(1284 - 25 * LEARNERS_PAGE_SIZE);
  });

  it('has a single empty page when there are no learners', () => {
    expect(learnersPage([], 3)).toEqual({
      page: 1,
      pageCount: 1,
      start: 0,
      learners: [],
    });
  });
});
