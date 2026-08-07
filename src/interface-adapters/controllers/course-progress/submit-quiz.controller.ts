import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import {
  quizScore,
  type CourseQuizResult,
} from '@/src/entities/models/course-progress';
import { quizSelectionsSchema, type Quiz } from '@/src/entities/models/quiz';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISubmitQuizUseCase } from '@/src/application/use-cases/course-progress/submit-quiz.use-case';

const inputSchema = z.object({
  courseSlug: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
  selections: quizSelectionsSchema,
});

function presenter(
  quizResult: CourseQuizResult,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'submitQuiz Presenter', op: 'serialize' },
    () => ({
      lessonId: quizResult.lessonId,
      result: {
        outcomes: quizResult.outcomes,
        correct: quizResult.correct,
        total: quizResult.total,
        score: quizScore(quizResult),
        passed: quizResult.passed,
      },
    })
  );
}

export type ISubmitQuizController = ReturnType<typeof submitQuizController>;

export const submitQuizController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    submitQuizUseCase: ISubmitQuizUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined,
    canonicalQuiz: Quiz
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'submitQuiz Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to submit a quiz');
        }

        const { session } =
          await authenticationService.validateSession(sessionId);
        const { data, error } = inputSchema.safeParse(input);

        if (error) {
          throw new InputParseError('Invalid data', { cause: error });
        }

        const result = await submitQuizUseCase(
          { ...data, quiz: canonicalQuiz },
          session.userId
        );

        return presenter(result, instrumentationService);
      }
    );
  };
