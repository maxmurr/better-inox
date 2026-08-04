import { IOAuthAccountsRepository } from '@/src/application/repositories/oauth-accounts.repository.interface';
import { ITodosRepository } from '@/src/application/repositories/todos.repository.interface';
import { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IOAuthService } from '@/src/application/services/oauth.service.interface';
import { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';
import { ISignInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { ISignInUseCase } from '@/src/application/use-cases/auth/sign-in.use-case';
import { ISignOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { ISignUpUseCase } from '@/src/application/use-cases/auth/sign-up.use-case';
import { IStartGoogleSignInUseCase } from '@/src/application/use-cases/auth/start-google-sign-in.use-case';
import { ICreateTodoUseCase } from '@/src/application/use-cases/todos/create-todo.use-case';
import { IDeleteTodoUseCase } from '@/src/application/use-cases/todos/delete-todo.use-case';
import { IGetTodosForUserUseCase } from '@/src/application/use-cases/todos/get-todos-for-user.use-case';
import { IToggleTodoUseCase } from '@/src/application/use-cases/todos/toggle-todo.use-case';
import { IGetCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { IGoogleCallbackController } from '@/src/interface-adapters/controllers/auth/google-callback.controller';
import { ISignInController } from '@/src/interface-adapters/controllers/auth/sign-in.controller';
import { ISignOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';
import { ISignUpController } from '@/src/interface-adapters/controllers/auth/sign-up.controller';
import { IStartGoogleSignInController } from '@/src/interface-adapters/controllers/auth/start-google-sign-in.controller';
import { IBulkUpdateController } from '@/src/interface-adapters/controllers/todos/bulk-update.controller';
import { ICreateTodoController } from '@/src/interface-adapters/controllers/todos/create-todo.controller';
import { IGetTodosForUserController } from '@/src/interface-adapters/controllers/todos/get-todos-for-user.controller';
import { IToggleTodoController } from '@/src/interface-adapters/controllers/todos/toggle-todo.controller';

export const DI_SYMBOLS = {
  // Services
  IAuthenticationService: Symbol.for('IAuthenticationService'),
  IOAuthService: Symbol.for('IOAuthService'),
  ITransactionManagerService: Symbol.for('ITransactionManagerService'),
  IInstrumentationService: Symbol.for('IInstrumentationService'),
  ICrashReporterService: Symbol.for('ICrashReporterService'),

  // Repositories
  ITodosRepository: Symbol.for('ITodosRepository'),
  IUsersRepository: Symbol.for('IUsersRepository'),
  IOAuthAccountsRepository: Symbol.for('IOAuthAccountsRepository'),

  // Use Cases
  ICreateTodoUseCase: Symbol.for('ICreateTodoUseCase'),
  IDeleteTodoUseCase: Symbol.for('IDeleteTodoUseCase'),
  IGetTodosForUserUseCase: Symbol.for('IGetTodosForUserUseCase'),
  IToggleTodoUseCase: Symbol.for('IToggleTodoUseCase'),
  ISignInUseCase: Symbol.for('ISignInUseCase'),
  ISignOutUseCase: Symbol.for('ISignOutUseCase'),
  ISignUpUseCase: Symbol.for('ISignUpUseCase'),
  IStartGoogleSignInUseCase: Symbol.for('IStartGoogleSignInUseCase'),
  ISignInWithGoogleUseCase: Symbol.for('ISignInWithGoogleUseCase'),

  // Controllers
  IGetCurrentUserController: Symbol.for('IGetCurrentUserController'),
  ISignInController: Symbol.for('ISignInController'),
  ISignOutController: Symbol.for('ISignOutController'),
  ISignUpController: Symbol.for('ISignUpController'),
  IStartGoogleSignInController: Symbol.for('IStartGoogleSignInController'),
  IGoogleCallbackController: Symbol.for('IGoogleCallbackController'),
  IBulkUpdateController: Symbol.for('IBulkUpdateController'),
  ICreateTodoController: Symbol.for('ICreateTodoController'),
  IGetTodosForUserController: Symbol.for('IGetTodosForUserController'),
  IToggleTodoController: Symbol.for('IToggleTodoController'),
};

export interface DI_RETURN_TYPES {
  // Services
  IAuthenticationService: IAuthenticationService;
  IOAuthService: IOAuthService;
  ITransactionManagerService: ITransactionManagerService;
  IInstrumentationService: IInstrumentationService;
  ICrashReporterService: ICrashReporterService;

  // Repositories
  ITodosRepository: ITodosRepository;
  IUsersRepository: IUsersRepository;
  IOAuthAccountsRepository: IOAuthAccountsRepository;

  // Use Cases
  ICreateTodoUseCase: ICreateTodoUseCase;
  IDeleteTodoUseCase: IDeleteTodoUseCase;
  IGetTodosForUserUseCase: IGetTodosForUserUseCase;
  IToggleTodoUseCase: IToggleTodoUseCase;
  ISignInUseCase: ISignInUseCase;
  ISignOutUseCase: ISignOutUseCase;
  ISignUpUseCase: ISignUpUseCase;
  IStartGoogleSignInUseCase: IStartGoogleSignInUseCase;
  ISignInWithGoogleUseCase: ISignInWithGoogleUseCase;

  // Controllers
  IGetCurrentUserController: IGetCurrentUserController;
  ISignInController: ISignInController;
  ISignOutController: ISignOutController;
  ISignUpController: ISignUpController;
  IStartGoogleSignInController: IStartGoogleSignInController;
  IGoogleCallbackController: IGoogleCallbackController;
  IBulkUpdateController: IBulkUpdateController;
  ICreateTodoController: ICreateTodoController;
  IGetTodosForUserController: IGetTodosForUserController;
  IToggleTodoController: IToggleTodoController;
}
