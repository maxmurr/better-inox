import { z } from 'zod';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import type { CourseLessonProgress } from '@/src/entities/models/course-progress';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { ISetLessonCompletionUseCase } from '@/src/application/use-cases/course-progress/set-lesson-completion.use-case';

const inputSchema = z.object({
  courseSlug: z.string().trim().min(1),
  lessonId: z.string().trim().min(1),
  completed: z.boolean(),
});

function presenter(
  progress: CourseLessonProgress,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'setLessonCompletion Presenter', op: 'serialize' },
    () => ({ lessonId: progress.lessonId, completed: progress.completed })
  );
}

export type ISetLessonCompletionController = ReturnType<
  typeof setLessonCompletionController
>;

export const setLessonCompletionController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService,
    setLessonCompletionUseCase: ISetLessonCompletionUseCase
  ) =>
  async (
    input: Partial<z.infer<typeof inputSchema>>,
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'setLessonCompletion Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError(
            'Must be logged in to update lesson progress'
          );
        }

        const { session } =
          await authenticationService.validateSession(sessionId);
        const { data, error } = inputSchema.safeParse(input);

        if (error) {
          throw new InputParseError('Invalid data', { cause: error });
        }

        const progress = await setLessonCompletionUseCase(data, session.userId);

        return presenter(progress, instrumentationService);
      }
    );
  };
