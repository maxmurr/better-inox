import { getLessonLearningResultsAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import { expect, test } from '@/playwright/fixtures';

const QUIZ_PATH = '/c/four-pillars/maintainability/quiz-maintainability';
const RESULTS_PATH = `${QUIZ_PATH}/results`;

const RECORDED_LESSON_RESULTS = {
  summary: {
    startedCount: 3,
    completedCount: 2,
    completionRate: 2 / 3,
    quizSubmissionCount: 2,
    averageQuizScore: 0.8,
  },
  learners: [
    {
      learnerId: 'learner-aisha',
      username: 'Aisha Khan',
      avatarUrl: null,
      completed: true,
      quizResult: {
        correct: 5,
        total: 5,
        score: 1,
        passed: true,
      },
    },
    {
      learnerId: 'learner-ben',
      username: 'Ben Ortiz',
      avatarUrl: null,
      completed: true,
      quizResult: {
        correct: 3,
        total: 5,
        score: 0.6,
        passed: false,
      },
    },
    {
      learnerId: 'learner-camille',
      username: 'Camille Dubois',
      avatarUrl: null,
      completed: false,
      quizResult: null,
    },
  ],
};

test('opens results from the original lesson and shows recorded learner outcomes', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(getLessonLearningResultsAdapter, RECORDED_LESSON_RESULTS);
  await page.goto(QUIZ_PATH);

  const resultsLink = page.getByRole('link', { name: 'Results' });
  await expect(resultsLink).toHaveAttribute('href', RESULTS_PATH);
  await resultsLink.click();

  await expect(page).toHaveURL(RESULTS_PATH);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Quiz - Maintainability'
  );

  const summary = page.getByRole('region', { name: 'Results summary' });
  await expect(summary).toContainText('3');
  await expect(summary).toContainText('2 of 3');
  await expect(summary).toContainText('80%');
  await expect(summary).toContainText('2 quiz submissions.');

  const table = page.getByRole('table');
  await expect(table.getByRole('row')).toHaveCount(4);
  const aishaRow = table.getByRole('row', {
    name: /Aisha Khan Completed 100% · 5\/5 Passed/,
  });
  await expect(aishaRow).toBeVisible();
  await expect(
    table.getByRole('row', {
      name: /Ben Ortiz Completed 60% · 3\/5 Needs review/,
    })
  ).toBeVisible();
  await expect(
    table.getByRole('row', {
      name: /Camille Dubois In progress — Not submitted/,
    })
  ).toBeVisible();

  const completionHeaderBox = await table
    .getByRole('columnheader', { name: 'Completion' })
    .boundingBox();
  const completionBadgeBox = await aishaRow
    .getByText('Completed', { exact: true })
    .boundingBox();
  const understandingHeaderBox = await table
    .getByRole('columnheader', { name: 'Understanding' })
    .boundingBox();
  const understandingBadgeBox = await aishaRow
    .getByText('Passed', { exact: true })
    .boundingBox();
  const scoreHeaderTextBox = await table
    .getByRole('columnheader', { name: 'Score' })
    .evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const bounds = range.getBoundingClientRect();
      return { x: bounds.x, width: bounds.width };
    });
  const scoreValueTextBox = await aishaRow
    .getByText('100% · 5/5', { exact: true })
    .evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const bounds = range.getBoundingClientRect();
      return { x: bounds.x, width: bounds.width };
    });

  expect(completionHeaderBox).not.toBeNull();
  expect(completionBadgeBox).not.toBeNull();
  expect(understandingHeaderBox).not.toBeNull();
  expect(understandingBadgeBox).not.toBeNull();
  expect(
    Math.abs(
      completionHeaderBox!.x +
        completionHeaderBox!.width / 2 -
        (completionBadgeBox!.x + completionBadgeBox!.width / 2)
    )
  ).toBeLessThan(2);
  expect(
    Math.abs(
      understandingHeaderBox!.x +
        understandingHeaderBox!.width / 2 -
        (understandingBadgeBox!.x + understandingBadgeBox!.width / 2)
    )
  ).toBeLessThan(2);
  expect(Math.abs(scoreHeaderTextBox.x - scoreValueTextBox.x)).toBeLessThan(2);
});

test('keeps the compact learner table readable on mobile', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signedIn();
  await stubAdapter(getLessonLearningResultsAdapter, RECORDED_LESSON_RESULTS);
  await page.goto(RESULTS_PATH);

  const summary = page.getByRole('region', { name: 'Results summary' });
  const summaryLabels = await Promise.all(
    ['Started', 'Completed', 'Average quiz score'].map(async (label) => {
      const box = await summary.getByText(label, { exact: true }).boundingBox();
      expect(box).not.toBeNull();
      return box!;
    })
  );
  expect(summaryLabels[1].y).toBeGreaterThan(summaryLabels[0].y);
  expect(summaryLabels[2].y).toBeGreaterThan(summaryLabels[1].y);

  const table = page.getByRole('table');
  await expect(table.getByRole('row')).toHaveCount(4);
  await expect(table.getByText('Needs review')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
});
