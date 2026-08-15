import { createModule } from '@evyweb/ioctopus';

import { getCourseProgressUseCase } from '@/src/application/use-cases/course-progress/get-course-progress.use-case';
import { getLessonLearningResultsUseCase } from '@/src/application/use-cases/course-progress/get-lesson-learning-results.use-case';
import { setLessonCompletionUseCase } from '@/src/application/use-cases/course-progress/set-lesson-completion.use-case';
import { submitQuizUseCase } from '@/src/application/use-cases/course-progress/submit-quiz.use-case';
import { CourseProgressRepository } from '@/src/infrastructure/repositories/course-progress.repository';
import { MockCourseProgressRepository } from '@/src/infrastructure/repositories/course-progress.repository.mock';
import { getCourseProgressController } from '@/src/interface-adapters/controllers/course-progress/get-course-progress.controller';
import { getLessonLearningResultsController } from '@/src/interface-adapters/controllers/course-progress/get-lesson-learning-results.controller';
import { setLessonCompletionController } from '@/src/interface-adapters/controllers/course-progress/set-lesson-completion.controller';
import { submitQuizController } from '@/src/interface-adapters/controllers/course-progress/submit-quiz.controller';

import { DI_SYMBOLS } from '@/di/types';

export function createCourseProgressModule() {
  const courseProgressModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    courseProgressModule
      .bind(DI_SYMBOLS.ICourseProgressRepository)
      .toClass(MockCourseProgressRepository, [DI_SYMBOLS.IUsersRepository]);
  } else {
    courseProgressModule
      .bind(DI_SYMBOLS.ICourseProgressRepository)
      .toClass(CourseProgressRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  courseProgressModule
    .bind(DI_SYMBOLS.IGetCourseProgressUseCase)
    .toHigherOrderFunction(getCourseProgressUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ICourseProgressRepository,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.IGetLessonLearningResultsUseCase)
    .toHigherOrderFunction(getLessonLearningResultsUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ICourseProgressRepository,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.ISetLessonCompletionUseCase)
    .toHigherOrderFunction(setLessonCompletionUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ICourseProgressRepository,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.ISubmitQuizUseCase)
    .toHigherOrderFunction(submitQuizUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ICourseProgressRepository,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.IGetCourseProgressController)
    .toHigherOrderFunction(getCourseProgressController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetCourseProgressUseCase,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.IGetLessonLearningResultsController)
    .toHigherOrderFunction(getLessonLearningResultsController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.IGetLessonLearningResultsUseCase,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.ISetLessonCompletionController)
    .toHigherOrderFunction(setLessonCompletionController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISetLessonCompletionUseCase,
    ]);

  courseProgressModule
    .bind(DI_SYMBOLS.ISubmitQuizController)
    .toHigherOrderFunction(submitQuizController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISubmitQuizUseCase,
    ]);

  return courseProgressModule;
}
