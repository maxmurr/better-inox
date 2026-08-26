import { ICourseProgressRepository } from '@/src/application/repositories/course-progress.repository.interface';
import { IOAuthAccountsRepository } from '@/src/application/repositories/oauth-accounts.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { IDatabaseHealthService } from '@/src/application/services/database-health.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IOAuthService } from '@/src/application/services/oauth.service.interface';
import { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { IStartGoogleSignInUseCase } from '@/src/application/use-cases/auth/start-google-sign-in.use-case';
import { IGetCourseProgressUseCase } from '@/src/application/use-cases/course-progress/get-course-progress.use-case';
import { IGetLessonLearningResultsUseCase } from '@/src/application/use-cases/course-progress/get-lesson-learning-results.use-case';
import { ISetLessonCompletionUseCase } from '@/src/application/use-cases/course-progress/set-lesson-completion.use-case';
import { ISubmitQuizUseCase } from '@/src/application/use-cases/course-progress/submit-quiz.use-case';
import { IGetCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { IGoogleCallbackController } from '@/src/interface-adapters/controllers/auth/google-callback.controller';
import { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { IStartGoogleSignInController } from '@/src/interface-adapters/controllers/auth/start-google-sign-in.controller';
import { IGetCourseProgressController } from '@/src/interface-adapters/controllers/course-progress/get-course-progress.controller';
import { IGetLessonLearningResultsController } from '@/src/interface-adapters/controllers/course-progress/get-lesson-learning-results.controller';
import { ISetLessonCompletionController } from '@/src/interface-adapters/controllers/course-progress/set-lesson-completion.controller';
import { ISubmitQuizController } from '@/src/interface-adapters/controllers/course-progress/submit-quiz.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  IOAuthService: Symbol.for('IOAuthService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IDatabaseHealthService: Symbol.for('IDatabaseHealthService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),
  IRateLimiterService: Symbol.for('IRateLimiterService'),

  // Repositories
  ICourseProgressRepository: Symbol.for('ICourseProgressRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),
  IOAuthAccountsRepository: Symbol.for('IOAuthAccountsRepository'),

  // Use Cases
  IGetCourseProgressUseCase: Symbol.for('IGetCourseProgressUseCase'),
  IGetLessonLearningResultsUseCase: Symbol.for(
    'IGetLessonLearningResultsUseCase'
  ),
  ISetLessonCompletionUseCase: Symbol.for('ISetLessonCompletionUseCase'),
  ISubmitQuizUseCase: Symbol.for('ISubmitQuizUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  IStartGoogleSignInUseCase: Symbol.for('IStartGoogleSignInUseCase'),
  ISignInWithGoogleUseCase: Symbol.for('ISignInWithGoogleUseCase'),

  // Controllers
  IGetCurrentUserController: Symbol.for('IGetCurrentUserController'),
  ISignOutController: Symbol.for('ISignOutController'),
  IStartGoogleSignInController: Symbol.for('IStartGoogleSignInController'),
  IGoogleCallbackController: Symbol.for('IGoogleCallbackController'),
  IGetCourseProgressController: Symbol.for('IGetCourseProgressController'),
  IGetLessonLearningResultsController: Symbol.for(
    'IGetLessonLearningResultsController'
  ),
  ISetLessonCompletionController: Symbol.for('ISetLessonCompletionController'),
  ISubmitQuizController: Symbol.for('ISubmitQuizController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  IOAuthService: IOAuthService;
  ITransactionManagerService: ITransactionManagerService;
  IDatabaseHealthService: IDatabaseHealthService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;
  IRateLimiterService: IRateLimiterService;

  // Repositories
  ICourseProgressRepository: ICourseProgressRepository;
  IUsersRepository: IUsersRepository;
  IOAuthAccountsRepository: IOAuthAccountsRepository;

  // Use Cases
  IGetCourseProgressUseCase: IGetCourseProgressUseCase;
  IGetLessonLearningResultsUseCase: IGetLessonLearningResultsUseCase;
  ISetLessonCompletionUseCase: ISetLessonCompletionUseCase;
  ISubmitQuizUseCase: ISubmitQuizUseCase;
  ISignOutUseCase: ISignOutUseCase;
  IStartGoogleSignInUseCase: IStartGoogleSignInUseCase;
  ISignInWithGoogleUseCase: ISignInWithGoogleUseCase;

  // Controllers
  IGetCurrentUserController: IGetCurrentUserController;
  ISignOutController: ISignOutController;
  IStartGoogleSignInController: IStartGoogleSignInController;
  IGoogleCallbackController: IGoogleCallbackController;
  IGetCourseProgressController: IGetCourseProgressController;
  IGetLessonLearningResultsController: IGetLessonLearningResultsController;
  ISetLessonCompletionController: ISetLessonCompletionController;
  ISubmitQuizController: ISubmitQuizController;
}
