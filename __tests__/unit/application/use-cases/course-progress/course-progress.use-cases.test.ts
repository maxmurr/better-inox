import { describe, expect, it } from 'vitest';

import { InputParseError } from '@/src/entities/errors/common';
import { quizSchema } from '@/src/entities/models/quiz';

import { getInjection } from '@/di/container';

const getCourseProgress = getInjection('IGetCourseProgressUseCase');
const setLessonCompletion = getInjection('ISetLessonCompletionUseCase');
const submitQuiz = getInjection('ISubmitQuizUseCase');

const COURSE = 'course';
const LESSON = 'section/lesson';
const quiz = quizSchema.parse({
  passThreshold: 1,
  questions: [
    {
      id: 'q1',
      kind: 'single',
      prompt: 'Correct?',
      options: [
        { id: 'wrong', text: 'Wrong' },
        { id: 'right', text: 'Right' },
      ],
      correctOptionIds: ['right'],
    },
  ],
});

describe('course progress use cases', () => {
  it('sets an explicit completion state reversibly and isolates users', async () => {
    await setLessonCompletion(
      { courseSlug: COURSE, lessonId: LESSON, completed: true },
      'user-1'
    );
    await setLessonCompletion(
      { courseSlug: COURSE, lessonId: LESSON, completed: false },
      'user-1'
    );

    await expect(getCourseProgress('user-1', COURSE)).resolves.toMatchObject({
      lessons: [{ lessonId: LESSON, completed: false }],
      quizResults: [],
    });
    await expect(getCourseProgress('user-2', COURSE)).resolves.toEqual({
      lessons: [],
      quizResults: [],
    });
  });

  it('replaces the latest quiz result with a server-graded result', async () => {
    await submitQuiz(
      {
        courseSlug: COURSE,
        lessonId: LESSON,
        selections: { q1: ['wrong'] },
        quiz,
      },
      'user-1'
    );

    const replacement = await submitQuiz(
      {
        courseSlug: COURSE,
        lessonId: LESSON,
        selections: { q1: ['right'] },
        quiz,
        // A caller cannot provide score/pass fields; the use case derives them.
        score: 999,
        passed: false,
      } as Parameters<typeof submitQuiz>[0],
      'user-1'
    );

    expect(replacement).toMatchObject({
      correct: 1,
      total: 1,
      passed: true,
      outcomes: [{ selectedOptionIds: ['right'], isCorrect: true }],
    });

    const progress = await getCourseProgress('user-1', COURSE);
    expect(progress.quizResults).toHaveLength(1);
    expect(progress.quizResults[0]).toMatchObject({ correct: 1, passed: true });
  });

  it.each([
    undefined,
    {},
    { q1: [] },
    { q1: ['not-an-option'] },
    { q1: ['right'], staleQuestion: ['right'] },
  ])('rejects an invalid submission: %s', async (selections) => {
    await expect(
      submitQuiz(
        { courseSlug: COURSE, lessonId: LESSON, selections, quiz },
        'user-1'
      )
    ).rejects.toBeInstanceOf(InputParseError);
  });
});
