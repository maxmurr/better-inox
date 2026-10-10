// ponytail: pages are sliced after the repository loads every learner, because
// the summary needs all of them anyway. Move to SQL LIMIT/OFFSET plus an
// aggregate query if one lesson reaches tens of thousands of learners.
export const LEARNERS_PAGE_SIZE = 50;

/** Reads `?page=`; anything other than a positive integer means page 1. */
export function parseLearnersPage(value: string | string[] | undefined) {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** Returns one page of learners, clamping past-the-end pages to the last one. */
export function learnersPage<T>(learners: readonly T[], requestedPage: number) {
  const pageCount = Math.max(
    1,
    Math.ceil(learners.length / LEARNERS_PAGE_SIZE)
  );
  const page = Math.min(requestedPage, pageCount);
  const start = (page - 1) * LEARNERS_PAGE_SIZE;

  return {
    page,
    pageCount,
    start,
    learners: learners.slice(start, start + LEARNERS_PAGE_SIZE),
  };
}
