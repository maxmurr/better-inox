import { createModule } from '@evyweb/ioctopus';

import { signOutUseCase } from '@/src/application/use-cases/auth/sign-out.use-case';
import { AuthenticationService } from '@/src/infrastructure/services/authentication.service';
import { MockAuthenticationService } from '@/src/infrastructure/services/authentication.service.mock';
import { getCurrentUserController } from '@/src/interface-adapters/controllers/auth/get-current-user.controller';
import { signOutController } from '@/src/interface-adapters/controllers/auth/sign-out.controller';

import { DI_SYMBOLS } from '@/di/types';

export function createAuthenticationModule() {
  const authenticationModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(MockAuthenticationService, [DI_SYMBOLS.IUsersRepository]);
  } else {
    authenticationModule
      .bind(DI_SYMBOLS.IAuthenticationService)
      .toClass(AuthenticationService, [
        DI_SYMBOLS.IUsersRepository,
        DI_SYMBOLS.IInstrumentationService,
      ]);
  }

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutUseCase)
    .toHigherOrderFunction(signOutUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.IGetCurrentUserController)
    .toHigherOrderFunction(getCurrentUserController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
    ]);

  authenticationModule
    .bind(DI_SYMBOLS.ISignOutController)
    .toHigherOrderFunction(signOutController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ISignOutUseCase,
    ]);

  return authenticationModule;
}
