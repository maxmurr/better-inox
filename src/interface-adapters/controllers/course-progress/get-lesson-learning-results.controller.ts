import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import {
  quizScore,
  type LessonLearningResultsSnapshot,
} from '@/src/entities/models/course-progress';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IGetLessonLearningResultsUseCase } from '@/src/application/use-cases/course-progress/get-lesson-learning-results.use-case';

const inputSchema = z.object({
  courseSlug: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
});

type PresentedLessonLearner = {
  learnerId: string;
  username: string;
  avatarUrl: string | null;
  completed: boolean;
  quizResult: {
    correct: number;
    total: number;
    score: number;
    passed: boolean;
  } | null;
};

function presenter(
  results: LessonLearningResultsSnapshot,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getLessonLearningResults Presenter', op: 'serialize' },
    () => {
      const learnerById = new Map<string, PresentedLessonLearner>();

      for (const progress of results.lessonProgress) {
        learnerById.set(progress.learnerId, {
          learnerId: progress.learnerId,
          username: progress.username,
          avatarUrl: progress.avatarUrl,
          completed: progress.completed,
          quizResult: null,
        });
      }

      for (const quizResult of results.quizResults) {
        const learner: PresentedLessonLearner = learnerById.get(
          quizResult.learnerId
        ) ?? {
          learnerId: quizResult.learnerId,
          username: quizResult.username,
          avatarUrl: quizResult.avatarUrl,
          completed: false,
          quizResult: null,
        };
        learner.quizResult = {
          correct: quizResult.correct,
          total: quizResult.total,
          score: quizScore(quizResult),
          passed: quizResult.passed,
        };
        learnerById.set(quizResult.learnerId, learner);
      }

      const learners = [...learnerById.values()].sort((left, right) =>
        left.username.localeCompare(right.username)
      );
      const completedCount = learners.filter(
        (learner) => learner.completed
      ).length;
      const quizSubmissionCount = results.quizResults.length;
      const totalQuizScore = results.quizResults.reduce(
        (total, quizResult) => total + quizScore(quizResult),
        0
      );

      return {
        summary: {
          startedCount: learners.length,
          completedCount,
          completionRate:
            learners.length === 0 ? 0 : completedCount / learners.length,
          quizSubmissionCount,
          averageQuizScore:
            quizSubmissionCount === 0
              ? null
              : totalQuizScore / quizSubmissionCount,
        },
        learners,
      };
    }
  );
}

export type PresentedLessonLearningResults = ReturnType<typeof presenter>;

export type IGetLessonLearningResultsController = ReturnType<
  typeof getLessonLearningResultsController
>;

export const getLessonLearningResultsController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getLessonLearningResultsUseCase: IGetLessonLearningResultsUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getLessonLearningResults Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to view lesson results'
          );
        }

        await authenticationService.validateSession(sessionId);
        const { data, error } = inputSchema.safeParse(input);

        if (error) {
          throw new InputParseError('Invalid data', { cause: error });
        }

        const results = await getLessonLearningResultsUseCase(
          data.courseSlug,
          data.lessonId
        );

        return presenter(results, instrumentationService);
      }
    );
  };
