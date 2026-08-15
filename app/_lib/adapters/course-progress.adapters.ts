import { z } from 'zod';

import { learnerCourseProgressSchema } from '@/src/entities/models/course-progress';
import {
  quizAttemptResultSchema,
  type Quiz,
  type QuizSelections,
} from '@/src/entities/models/quiz';

import { createAdapter } from '../adapter-service';

const lessonLearningResultsSchema = z.object({
  summary: z.object({
    startedCount: z.number(),
    completedCount: z.number(),
    completionRate: z.number(),
    quizSubmissionCount: z.number(),
    averageQuizScore: z.number().nullable(),
  }),
  learners: z.array(
    z.object({
      learnerId: z.string(),
      username: z.string(),
      avatarUrl: z.string().nullable(),
      completed: z.boolean(),
      quizResult: z
        .object({
          correct: z.number(),
          total: z.number(),
          score: z.number(),
          passed: z.boolean(),
        })
        .nullable(),
    })
  ),
});

const lessonCompletionResultSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean(),
});

const quizSubmissionResultSchema = z.object({
  lessonId: z.string(),
  result: quizAttemptResultSchema,
});

export const getCourseProgressAdapter = createAdapter({
  name: 'getCourseProgress',
  stubSchema: learnerCourseProgressSchema,
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
  stubSchema: lessonLearningResultsSchema,
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
  stubSchema: lessonCompletionResultSchema,
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
  stubSchema: quizSubmissionResultSchema,
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
