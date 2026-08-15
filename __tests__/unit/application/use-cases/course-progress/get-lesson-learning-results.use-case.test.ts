import { describe, expect, it } from 'vitest';

import { quizSchema } from '@/src/entities/models/quiz';

import { getInjection } from '@/di/container';

const getLessonLearningResults = getInjection(
  'IGetLessonLearningResultsUseCase'
);
const setLessonCompletion = getInjection('ISetLessonCompletionUseCase');
const submitQuiz = getInjection('ISubmitQuizUseCase');

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

describe('get lesson learning results use case', () => {
  it('loads recorded completion and latest quiz activity across learners', async () => {
    const courseSlug = 'lesson-results-course';
    const lessonId = 'section/results-lesson';

    await setLessonCompletion(
      { courseSlug, lessonId, completed: false },
      'results-user-a'
    );
    await setLessonCompletion(
      { courseSlug, lessonId, completed: true },
      'results-user-b'
    );
    await submitQuiz(
      { courseSlug, lessonId, selections: { q1: ['right'] }, quiz },
      'results-user-b'
    );

    const results = await getLessonLearningResults(courseSlug, lessonId);

    expect(results.lessonProgress).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          learnerId: 'results-user-a',
          completed: false,
        }),
        expect.objectContaining({
          learnerId: 'results-user-b',
          completed: true,
        }),
      ])
    );
    expect(results.quizResults).toEqual([
      expect.objectContaining({
        learnerId: 'results-user-b',
        correct: 1,
        total: 1,
        passed: true,
      }),
    ]);
  });
});
