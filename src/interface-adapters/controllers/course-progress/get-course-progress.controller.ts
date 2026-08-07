import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import {
  quizScore,
  type CourseProgressSnapshot,
} from '@/src/entities/models/course-progress';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IGetCourseProgressUseCase } from '@/src/application/use-cases/course-progress/get-course-progress.use-case';

const inputSchema = z.object({ courseSlug: z.string().trim().min(1) });

function presenter(
  progress: CourseProgressSnapshot,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getCourseProgress Presenter', op: 'serialize' },
    () => ({
      completedLessonIds: progress.lessons
        .filter((lesson) => lesson.completed)
        .map((lesson) => lesson.lessonId),
      quizResults: progress.quizResults.map((quizResult) => ({
        lessonId: quizResult.lessonId,
        result: {
          outcomes: quizResult.outcomes,
          correct: quizResult.correct,
          total: quizResult.total,
          score: quizScore(quizResult),
          passed: quizResult.passed,
        },
      })),
    })
  );
}

export type IGetCourseProgressController = ReturnType<
  typeof getCourseProgressController
>;

export const getCourseProgressController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    getCourseProgressUseCase: IGetCourseProgressUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getCourseProgress Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to view course progress'
          );
        }

        const { session } =
          await authenticationService.validateSession(sessionId);
        const { data, error } = inputSchema.safeParse(input);

        if (error) {
          throw new InputParseError('Invalid data', { cause: error });
        }

        const progress = await getCourseProgressUseCase(
          session.userId,
          data.courseSlug
        );

        return presenter(progress, instrumentationService);
      }
    );
  };
