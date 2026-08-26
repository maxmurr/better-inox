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
const getCourseProgressController = getInjection(
  'IGetCourseProgressController'
);
const setLessonCompletionController = getInjection(
  'ISetLessonCompletionController'
);
const submitQuizController = getInjection('ISubmitQuizController');

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

describe('course progress controllers', () => {
  it('authenticates, saves reversible completion, and presents no identity', async () => {
    const { session } = await signInWithGoogleUseCase(
      googleCallback('course-progress-one')
    );

    await expect(
      setLessonCompletionController(
        {
          courseSlug: 'course',
          lessonId: 'section/lesson',
          completed: true,
        },
        session.id
      )
    ).resolves.toEqual({
      lessonId: 'section/lesson',
      completed: true,
    });

    const presented = await getCourseProgressController(
      { courseSlug: 'course' },
      session.id
    );
    expect(presented).toEqual({
      completedLessonIds: ['section/lesson'],
      quizResults: [],
    });
    expect(JSON.stringify(presented)).not.toContain('"userId"');

    await setLessonCompletionController(
      {
        courseSlug: 'course',
        lessonId: 'section/lesson',
        completed: false,
      },
      session.id
    );
    await expect(
      getCourseProgressController({ courseSlug: 'course' }, session.id)
    ).resolves.toEqual({ completedLessonIds: [], quizResults: [] });
  });

  it('returns a canonical latest quiz result with a derived score', async () => {
    const { session } = await signInWithGoogleUseCase(
      googleCallback('course-progress-two')
    );

    await expect(
      submitQuizController(
        {
          courseSlug: 'course',
          lessonId: 'section/quiz',
          selections: { q1: ['b'] },
        },
        session.id,
        quiz
      )
    ).resolves.toEqual({
      lessonId: 'section/quiz',
      result: {
        outcomes: [
          {
            questionId: 'q1',
            selectedOptionIds: ['b'],
            correctOptionIds: ['b'],
            isCorrect: true,
          },
        ],
        correct: 1,
        total: 1,
        score: 1,
        passed: true,
      },
    });
  });

  it('rejects unauthenticated and malformed requests', async () => {
    const { session } = await signInWithGoogleUseCase(
      googleCallback('course-progress-three')
    );

    await expect(
      setLessonCompletionController(
        {
          courseSlug: 'course',
          lessonId: 'section/lesson',
          completed: true,
        },
        undefined
      )
    ).rejects.toBeInstanceOf(UnauthenticatedError);

    await expect(
      setLessonCompletionController(
        { courseSlug: 'course', lessonId: 'section/lesson' },
        session.id
      )
    ).rejects.toBeInstanceOf(InputParseError);

    await expect(
      submitQuizController(
        {
          courseSlug: 'course',
          lessonId: 'section/quiz',
          selections: { q1: [] },
        },
        session.id,
        quiz
      )
    ).rejects.toBeInstanceOf(InputParseError);
  });
});
