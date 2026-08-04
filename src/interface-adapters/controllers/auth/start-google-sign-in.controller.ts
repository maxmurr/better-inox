import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IStartGoogleSignInUseCase } from '@/src/application/use-cases/auth/start-google-sign-in.use-case';

import {
  GOOGLE_CODE_VERIFIER_COOKIE,
  GOOGLE_STATE_COOKIE,
  OAUTH_COOKIE_MAX_AGE,
} from '@/config';

export type IStartGoogleSignInController = ReturnType<
  typeof startGoogleSignInController
>;

export const startGoogleSignInController =
  (
    instrumentationService: IInstrumentationService,
    startGoogleSignInUseCase: IStartGoogleSignInUseCase
  ) =>
  async (): Promise<{
    url: string;
    stateCookie: Cookie;
    codeVerifierCookie: Cookie;
  }> => {
    return await instrumentationService.startSpan(
      { name: 'startGoogleSignIn Controller' },
      async () => {
        const { url, state, codeVerifier } = await startGoogleSignInUseCase();

        return {
          url,
          stateCookie: oauthCookie(GOOGLE_STATE_COOKIE, state),
          codeVerifierCookie: oauthCookie(
            GOOGLE_CODE_VERIFIER_COOKIE,
            codeVerifier
          ),
        };
      }
    );
  };

function oauthCookie(name: string, value: string): Cookie {
  return {
    name,
    value,
    attributes: {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: OAUTH_COOKIE_MAX_AGE,
      secure: process.env.NODE_ENV === 'production',
    },
  };
}
