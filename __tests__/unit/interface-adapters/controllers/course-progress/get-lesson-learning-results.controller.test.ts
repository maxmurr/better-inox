import { describe, expect, it } from 'vitest';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { quizSchema } from '@/src/entities/models/quiz';
import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');
const getLessonLearningResults = getInjection(
  'IGetLessonLearningResultsController'
);
const setLessonCompletion = getInjection('ISetLessonCompletionController');
const submitQuiz = getInjection('ISubmitQuizController');

const googleCallback = (code: string) => ({
  code,
  state: MOCK_OAUTH_STATE,
  storedState: MOCK_OAUTH_STATE,
  codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
});

const quiz = quizSchema.parse({
  passThreshold: 0.5,
  questions: [
    {
      id: 'q1',
      kind: 'single',
      prompt: 'Pick one',
      options: [
        { id: 'a', text: 'A' },
        { id: 'b', text: 'B' },
      ],
      correctOptionIds: ['b'],
    },
  ],
});

describe('get lesson learning results controller', () => {
  it('presents minimal results recorded by multiple learner flows', async () => {
    const input = {
      courseSlug: 'lesson-results-controller-course',
      lessonId: 'section/results-quiz',
    };
    const first = await signInWithGoogleUseCase(
      googleCallback('lesson-results-one')
    );

    await setLessonCompletion({ ...input, completed: true }, first.session.id);
    await submitQuiz(
      { ...input, selections: { q1: ['b'] } },
      first.session.id,
      quiz
    );

    // Mock sessions share one ID, so finish first learner writes before next sign-in.
    const second = await signInWithGoogleUseCase(
      googleCallback('lesson-results-two')
    );

    await setLessonCompletion(
      { ...input, completed: false },
      second.session.id
    );
    await submitQuiz(
      { ...input, selections: { q1: ['a'] } },
      second.session.id,
      quiz
    );

    const presented = await getLessonLearningResults(input, second.session.id);

    expect(presented.summary).toEqual({
      startedCount: 2,
      completedCount: 1,
      completionRate: 0.5,
      quizSubmissionCount: 2,
      averageQuizScore: 0.5,
    });
    expect(presented.learners).toMatchObject([
      {
        username: 'lesson-results-one',
        completed: true,
        quizResult: { correct: 1, total: 1, score: 1, passed: true },
      },
      {
        username: 'lesson-results-two',
        completed: false,
        quizResult: { correct: 0, total: 1, score: 0, passed: false },
      },
    ]);
    expect(JSON.stringify(presented)).not.toContain('outcomes');
  });

  it('rejects unauthenticated and malformed requests', async () => {
    const user = await signInWithGoogleUseCase(
      googleCallback('lesson-results-three')
    );

    await expect(
      getLessonLearningResults(
        { courseSlug: 'lesson-results-controller-course' },
        user.session.id
      )
    ).rejects.toBeInstanceOf(InputParseError);

    await expect(
      getLessonLearningResults(
        {
          courseSlug: 'lesson-results-controller-course',
          lessonId: 'section/results-quiz',
        },
        undefined
      )
    ).rejects.toBeInstanceOf(UnauthenticatedError);
  });
});
