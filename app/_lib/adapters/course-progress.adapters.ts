import type { Quiz, QuizSelections } from '@/src/entities/models/quiz';

import { createAdapter } from '../adapter-service';

export const getCourseProgressAdapter = createAdapter({
  name: 'getCourseProgress',
  callback: async (courseSlug: string, sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetCourseProgressController')(
      { courseSlug },
      sessionId
    );
  },
});

export const getLessonLearningResultsAdapter = createAdapter({
  name: 'getLessonLearningResults',
  callback: async (
    courseSlug: string,
    lessonId: string,
    sessionId: string | undefined
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetLessonLearningResultsController')(
      { courseSlug, lessonId },
      sessionId
    );
  },
});

export type LessonLearningResultsData = Awaited<
  ReturnType<typeof getLessonLearningResultsAdapter>
>;

export const setLessonCompletionAdapter = createAdapter({
  name: 'setLessonCompletion',
  callback: async (
    input: { courseSlug: string; lessonId: string; completed: boolean },
    sessionId: string | undefined
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISetLessonCompletionController')(input, sessionId);
  },
});

export const submitQuizAdapter = createAdapter({
  name: 'submitQuiz',
  callback: async (
    input: {
      courseSlug: string;
      lessonId: string;
      selections: QuizSelections;
    },
    sessionId: string | undefined,
    canonicalQuiz: Quiz
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISubmitQuizController')(
      input,
      sessionId,
      canonicalQuiz
    );
  },
});
