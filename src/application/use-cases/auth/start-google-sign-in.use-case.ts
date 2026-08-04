import { GoogleAuthorizationRequest } from '@/src/entities/models/oauth';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IOAuthService } from '@/src/application/services/oauth.service.interface';

export type IStartGoogleSignInUseCase = ReturnType<
  typeof startGoogleSignInUseCase
>;

export const startGoogleSignInUseCase =
  (
    instrumentationService: IInstrumentationService,
    oauthService: IOAuthService
  ) =>
  (): Promise<GoogleAuthorizationRequest> => {
    return instrumentationService.startSpan(
      { name: 'startGoogleSignIn Use Case', op: 'function' },
      async () => {
        return oauthService.createGoogleAuthorizationRequest();
      }
    );
  };
