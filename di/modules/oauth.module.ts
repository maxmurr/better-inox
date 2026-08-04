import { createModule } from '@evyweb/ioctopus';

import { signInWithGoogleUseCase } from '@/src/application/use-cases/auth/sign-in-with-google.use-case';
import { startGoogleSignInUseCase } from '@/src/application/use-cases/auth/start-google-sign-in.use-case';
import { OAuthAccountsRepository } from '@/src/infrastructure/repositories/oauth-accounts.repository';
import { MockOAuthAccountsRepository } from '@/src/infrastructure/repositories/oauth-accounts.repository.mock';
import { OAuthService } from '@/src/infrastructure/services/oauth.service';
import { MockOAuthService } from '@/src/infrastructure/services/oauth.service.mock';
import { googleCallbackController } from '@/src/interface-adapters/controllers/auth/google-callback.controller';
import { startGoogleSignInController } from '@/src/interface-adapters/controllers/auth/start-google-sign-in.controller';

import { DI_SYMBOLS } from '@/di/types';

export function createOAuthModule() {
  const oauthModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    oauthModule.bind(DI_SYMBOLS.IOAuthService).toClass(MockOAuthService);
    oauthModule
      .bind(DI_SYMBOLS.IOAuthAccountsRepository)
      .toClass(MockOAuthAccountsRepository);
  } else {
    oauthModule
      .bind(DI_SYMBOLS.IOAuthService)
      .toClass(OAuthService, [DI_SYMBOLS.IInstrumentationService]);
    oauthModule
      .bind(DI_SYMBOLS.IOAuthAccountsRepository)
      .toClass(OAuthAccountsRepository, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  oauthModule
    .bind(DI_SYMBOLS.IStartGoogleSignInUseCase)
    .toHigherOrderFunction(startGoogleSignInUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IOAuthService,
    ]);

  oauthModule
    .bind(DI_SYMBOLS.ISignInWithGoogleUseCase)
    .toHigherOrderFunction(signInWithGoogleUseCase, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IOAuthService,
      DI_SYMBOLS.IAuthenticationService,
      DI_SYMBOLS.ITransactionManagerService,
      DI_SYMBOLS.IUsersRepository,
      DI_SYMBOLS.IOAuthAccountsRepository,
    ]);

  oauthModule
    .bind(DI_SYMBOLS.IStartGoogleSignInController)
    .toHigherOrderFunction(startGoogleSignInController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.IStartGoogleSignInUseCase,
    ]);

  oauthModule
    .bind(DI_SYMBOLS.IGoogleCallbackController)
    .toHigherOrderFunction(googleCallbackController, [
      DI_SYMBOLS.IInstrumentationService,
      DI_SYMBOLS.ISignInWithGoogleUseCase,
    ]);

  return oauthModule;
}
