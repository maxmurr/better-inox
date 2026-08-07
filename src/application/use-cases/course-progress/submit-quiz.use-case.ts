import { InputParseError } from '@/src/entities/errors/common';
import type { CourseQuizResult } from '@/src/entities/models/course-progress';
import {
  gradeQuizSelections,
  quizSchema,
  type Quiz,
} from '@/src/entities/models/quiz';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export type ISubmitQuizUseCase = ReturnType<typeof submitQuizUseCase>;

export const submitQuizUseCase =
  (
    instrumentationService: IInstrumentationService,
    courseProgressRepository: ICourseProgressRepository
  ) =>
  (
    input: {
      courseSlug: string;
      lessonId: string;
      selections: unknown;
      quiz: Quiz;
    },
    userId: string
  ): Promise<CourseQuizResult> => {
    return instrumentationService.startSpan(
      { name: 'submitQuiz Use Case', op: 'function' },
      async () => {
        const parsedQuiz = quizSchema.safeParse(input.quiz);
        if (!parsedQuiz.success) {
          throw new InputParseError('Invalid canonical quiz', {
            cause: parsedQuiz.error,
          });
        }

        const result = gradeQuizSelections(parsedQuiz.data, input.selections);

        return await courseProgressRepository.upsertQuizResult({
          userId,
          courseSlug: input.courseSlug,
          lessonId: input.lessonId,
          outcomes: result.outcomes,
          correct: result.correct,
          total: result.total,
          passed: result.passed,
        });
      }
    );
  };
