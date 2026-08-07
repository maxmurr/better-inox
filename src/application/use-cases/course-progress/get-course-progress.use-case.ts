import type { CourseProgressSnapshot } from '@/src/entities/models/course-progress';
import type { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

export type IGetCourseProgressUseCase = ReturnType<
  typeof getCourseProgressUseCase
>;

export const getCourseProgressUseCase =
  (
    instrumentationService: IInstrumentationService,
    courseProgressRepository: ICourseProgressRepository
  ) =>
  (userId: string, courseSlug: string): Promise<CourseProgressSnapshot> => {
    return instrumentationService.startSpan(
      { name: 'getCourseProgress Use Case', op: 'function' },
      () => courseProgressRepository.getCourseProgress(userId, courseSlug)
    );
  };
