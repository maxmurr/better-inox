import type { CourseLessonProgress } from '@/src/entities/models/course-progress';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export type ISetLessonCompletionUseCase = ReturnType<
  typeof setLessonCompletionUseCase
>;

export const setLessonCompletionUseCase =
  (
    instrumentationService: IInstrumentationService,
    courseProgressRepository: ICourseProgressRepository
  ) =>
  (
    input: { courseSlug: string; lessonId: string; completed: boolean },
    userId: string
  ): Promise<CourseLessonProgress> => {
    return instrumentationService.startSpan(
      { name: 'setLessonCompletion Use Case', op: 'function' },
      () =>
        courseProgressRepository.upsertLessonProgress({
          userId,
          courseSlug: input.courseSlug,
          lessonId: input.lessonId,
          completed: input.completed,
        })
    );
  };
