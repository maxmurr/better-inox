import { SESSION_COOKIE } from '@/config';

import { stubError } from '@/app/_lib/adapter-service';
import { getCurrentUserAdapter } from '@/app/_lib/adapters/auth.adapters';
import {
  getCourseProgressAdapter,
  setLessonCompletionAdapter,
  submitQuizAdapter,
} from '@/app/_lib/adapters/course-progress.adapters';
import { serializeTestStubValue } from '@/app/_lib/testing/test-stub-contract';
import {
  EMPTY_COURSE_PROGRESS,
  expect,
  test,
  TEST_USER,
} from '@/playwright/fixtures';

const COURSE_PATH = '/c/four-pillars';
const FIRST_LESSON_ID = 'maintainability/good-and-bad-automated-tests';
const FIRST_LESSON_PATH = `${COURSE_PATH}/${FIRST_LESSON_ID}`;
const COMPLETION_LESSON_ID = 'maintainability/readability';
const COMPLETION_LESSON_PATH = `${COURSE_PATH}/${COMPLETION_LESSON_ID}`;
const QUIZ_LESSON_ID = 'maintainability/quiz-maintainability';
const QUIZ_PATH = `${COURSE_PATH}/${QUIZ_LESSON_ID}`;
const MAINTAINABILITY_QUIZ_PATH = `${COURSE_PATH}/maintainability/quiz-maintainability`;
const POP_QUESTION_PATH = `${COURSE_PATH}/maintainability/good-and-bad-automated-tests`;

const PASSED_RESULT = {
  lessonId: QUIZ_LESSON_ID,
  result: {
    outcomes: [
      {
        questionId: 'q1',
        selectedOptionIds: ['a', 'c', 'e'],
        correctOptionIds: ['a', 'c', 'e'],
        isCorrect: true,
      },
      {
        questionId: 'q2',
        selectedOptionIds: ['c', 'd', 'e'],
        correctOptionIds: ['c', 'd', 'e'],
        isCorrect: true,
      },
    ],
    correct: 2,
    total: 2,
    score: 1,
    passed: true,
  },
};

const FAILED_RESULT = {
  lessonId: QUIZ_LESSON_ID,
  result: {
    outcomes: [
      {
        questionId: 'q1',
        selectedOptionIds: ['b'],
        correctOptionIds: ['a', 'c', 'e'],
        isCorrect: false,
      },
      {
        questionId: 'q2',
        selectedOptionIds: ['a'],
        correctOptionIds: ['c', 'd', 'e'],
        isCorrect: false,
      },
    ],
    correct: 0,
    total: 2,
    score: 0,
    passed: false,
  },
};

function restoredProgress(
  completedLessonIds: string[] = [],
  quizResults:
    typeof EMPTY_COURSE_PROGRESS.quizResults | [typeof PASSED_RESULT] = []
) {
  return { completedLessonIds, quizResults };
}

test('starts empty and restores the first-incomplete Continue target', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await page.goto(COURSE_PATH);

  await expect(page.getByRole('link', { name: /Continue/ })).toHaveAttribute(
    'href',
    FIRST_LESSON_PATH
  );
  await expect(
    page.getByRole('link', {
      name: /Good and Bad Automated Tests Not completed/,
    })
  ).toBeVisible();

  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([FIRST_LESSON_ID])
  );
  await page.reload();

  await expect(page.getByRole('link', { name: /Continue/ })).toHaveAttribute(
    'href',
    COMPLETION_LESSON_PATH
  );
  await expect(
    page.getByRole('link', {
      name: /Good and Bad Automated Tests Completed/,
    })
  ).toBeVisible();
});

test('persists reversible completion and updates every shared indicator', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(setLessonCompletionAdapter, {
    lessonId: COMPLETION_LESSON_ID,
    completed: true,
  });
  await page.goto(COMPLETION_LESSON_PATH);

  await page.getByRole('button', { name: 'Complete Lesson' }).click();
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();

  await page.getByRole('button', { name: 'Lessons', exact: true }).click();
  await expect(
    page.locator('#course-panel').getByRole('link', {
      name: /Readability Completed/,
    })
  ).toBeVisible();

  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([COMPLETION_LESSON_ID])
  );
  await page.reload();
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();

  await stubAdapter(setLessonCompletionAdapter, {
    lessonId: COMPLETION_LESSON_ID,
    completed: false,
  });
  await page.getByRole('button', { name: 'Completed' }).click();
  await expect(
    page.getByRole('button', { name: 'Complete Lesson' })
  ).toBeVisible();
});

test('allows a completed quiz lesson to be reversed without a saved quiz result', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([QUIZ_LESSON_ID])
  );
  await stubAdapter(setLessonCompletionAdapter, {
    lessonId: QUIZ_LESSON_ID,
    completed: false,
  });
  await page.goto(QUIZ_PATH);

  const completedLesson = page.getByRole('button', { name: 'Completed' });
  await expect(completedLesson).toBeEnabled();
  await completedLesson.click();

  await expect(
    page.getByRole('button', { name: 'Complete Lesson' })
  ).toBeDisabled();
});

test('requires pop questions before enabling lesson completion', async ({
  page,
  signedIn,
}) => {
  await signedIn();
  await page.goto(POP_QUESTION_PATH);

  const completeLesson = page.getByRole('button', {
    name: 'Complete Lesson',
  });
  const submitPopQuestion = page.getByRole('button', {
    name: 'Submit',
    exact: true,
  });

  await expect(completeLesson).toBeDisabled();
  await expect(submitPopQuestion).toBeDisabled();

  await page.getByRole('radio', { name: /Test case #2/ }).click();
  await expect(submitPopQuestion).toBeEnabled();
  await expect(completeLesson).toBeDisabled();

  await submitPopQuestion.click();
  await expect(completeLesson).toBeEnabled();
});

test('uses square checkboxes for multi-answer quiz questions', async ({
  page,
  signedIn,
}) => {
  await signedIn();
  await page.goto(MAINTAINABILITY_QUIZ_PATH);

  const firstChoice = page
    .locator('fieldset')
    .first()
    .getByRole('checkbox')
    .first();
  await expect(firstChoice).toHaveCSS('border-radius', '4px');
});

test('restores and replaces only the latest submitted quiz result', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(submitQuizAdapter, PASSED_RESULT);
  await page.goto(QUIZ_PATH);

  const completeLesson = page.getByRole('button', {
    name: 'Complete Lesson',
  });
  const submitAnswers = page.getByRole('button', { name: 'Submit Answers' });
  await expect(completeLesson).toBeDisabled();
  await expect(submitAnswers).toBeDisabled();
  await expect(
    page.getByText('Submit the quiz to complete this lesson.')
  ).toHaveCount(0);

  for (const checkbox of await page.getByRole('checkbox').all()) {
    await checkbox.click();
  }
  await expect(submitAnswers).toBeEnabled();
  await submitAnswers.click();

  await expect(page.getByText('100%')).toBeVisible();
  await expect(page.getByText('2/2')).toBeVisible();
  await expect(completeLesson).toBeEnabled();

  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([], [PASSED_RESULT])
  );
  await page.reload();
  await expect(page.getByText('100%')).toBeVisible();
  await expect(completeLesson).toBeEnabled();

  await page.getByRole('button', { name: 'Retake Quiz' }).click();
  await page.getByRole('button', { name: 'Retake & Clear Answers' }).click();
  await expect(completeLesson).toBeEnabled();
  for (const fieldset of await page.locator('fieldset').all()) {
    await fieldset.getByRole('checkbox').first().click();
  }

  await stubAdapter(submitQuizAdapter, FAILED_RESULT);
  await page.getByRole('button', { name: 'Submit Answers' }).click();
  await expect(page.getByText('0%')).toBeVisible();
  await expect(page.getByText('0/2')).toBeVisible();

  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([], [FAILED_RESULT])
  );
  await page.reload();
  await expect(page.getByText('0%')).toBeVisible();
  await expect(page.getByText('100%')).toHaveCount(0);
});

test('does not persist drafts or an unsubmitted retake', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await page.goto(QUIZ_PATH);

  await page.getByRole('checkbox').first().click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();

  await stubAdapter(
    getCourseProgressAdapter,
    restoredProgress([], [PASSED_RESULT])
  );
  await page.reload();
  await expect(page.getByText('100%')).toBeVisible();

  await page.getByRole('button', { name: 'Retake Quiz' }).click();
  await page.getByRole('button', { name: 'Retake & Clear Answers' }).click();
  await expect(page.getByText('100%')).toHaveCount(0);

  await page.reload();
  await expect(page.getByText('100%')).toBeVisible();
});

test('keeps selections and saved state unchanged after safe failures', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(
    setLessonCompletionAdapter,
    stubError('DatabaseOperationError', 'private database detail')
  );
  await page.goto(COMPLETION_LESSON_PATH);
  await page.getByRole('button', { name: 'Complete Lesson' }).click();

  await expect(page.getByText(/Could not save lesson progress/)).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Complete Lesson' })
  ).toBeVisible();
  await expect(page.getByText('private database detail')).toHaveCount(0);

  await stubAdapter(
    submitQuizAdapter,
    stubError('DatabaseOperationError', 'answer-key database detail')
  );
  await page.goto(QUIZ_PATH);
  for (const checkbox of await page.getByRole('checkbox').all()) {
    await checkbox.click();
  }
  await page.getByRole('button', { name: 'Submit Answers' }).click();

  await expect(
    page.getByRole('button', { name: 'Complete Lesson' })
  ).toBeDisabled();
  await expect(page.locator('p[role="alert"]')).toContainText(
    'Could not save the quiz result'
  );
  for (const checkbox of await page.getByRole('checkbox').all()) {
    await expect(checkbox).toBeChecked();
  }
  await expect(page.getByText('answer-key database detail')).toHaveCount(0);
});

test('isolates restored state between learner sessions', async ({
  browser,
}) => {
  const contexts = await Promise.all([
    browser.newContext({ baseURL: 'http://localhost:3100' }),
    browser.newContext({ baseURL: 'http://localhost:3100' }),
  ]);

  try {
    await Promise.all(
      contexts.map(async (context, index) => {
        const stubSession = `isolation-${index}-${crypto.randomUUID()}`;
        await context.addCookies([
          {
            name: 'x-test-session',
            value: stubSession,
            domain: 'localhost',
            path: '/',
          },
          {
            name: SESSION_COOKIE,
            value: `auth-${index}`,
            domain: 'localhost',
            path: '/',
          },
        ]);
        await context.request.post('/api/test-stubs', {
          data: {
            sessionId: stubSession,
            data: {
              [getCurrentUserAdapter.adapterName]: serializeTestStubValue(
                getCurrentUserAdapter.adapterName,
                {
                  ...TEST_USER,
                  id: `user-${index}`,
                  username: `learner${index}`,
                }
              ),
              [getCourseProgressAdapter.adapterName]: serializeTestStubValue(
                getCourseProgressAdapter.adapterName,
                index === 0
                  ? restoredProgress([FIRST_LESSON_ID])
                  : EMPTY_COURSE_PROGRESS
              ),
            },
          },
        });
      })
    );

    const [firstPage, secondPage] = await Promise.all(
      contexts.map((context) => context.newPage())
    );
    await Promise.all([
      firstPage.goto(COURSE_PATH),
      secondPage.goto(COURSE_PATH),
    ]);

    await expect(
      firstPage.getByRole('link', { name: /Continue/ })
    ).toHaveAttribute('href', COMPLETION_LESSON_PATH);
    await expect(
      secondPage.getByRole('link', { name: /Continue/ })
    ).toHaveAttribute('href', FIRST_LESSON_PATH);
  } finally {
    await Promise.all(contexts.map((context) => context.close()));
  }
});
