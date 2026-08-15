import type { LessonLearningResultsSnapshot } from '@/src/entities/models/course-progress';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export type IGetLessonLearningResultsUseCase = ReturnType<
  typeof getLessonLearningResultsUseCase
>;

export const getLessonLearningResultsUseCase =
  (
    instrumentationService: IInstrumentationService,
    courseProgressRepository: ICourseProgressRepository
  ) =>
  (
    courseSlug: string,
    lessonId: string
  ): Promise<LessonLearningResultsSnapshot> => {
    return instrumentationService.startSpan(
      { name: 'getLessonLearningResults Use Case', op: 'function' },
      () =>
        courseProgressRepository.getLessonLearningResults(courseSlug, lessonId)
    );
  };
