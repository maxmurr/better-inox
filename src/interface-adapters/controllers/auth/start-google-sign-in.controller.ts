import { Cookie } from '@/src/entities/models/cookie';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';
import { IStartGoogleSignInUseCase } from '@/src/application/use-cases/auth/start-google-sign-in.use-case';

import {
  GOOGLE_CODE_VERIFIER_COOKIE,
  GOOGLE_STATE_COOKIE,
  OAUTH_COOKIE_MAX_AGE,
  OAUTH_START_IP_RATE_LIMIT,
} from '@/config';

export type IStartGoogleSignInController = ReturnType<
  typeof startGoogleSignInController
>;

export const startGoogleSignInController =
  (
    instrumentationService: IInstrumentationService,
    rateLimiterService: IRateLimiterService,
    startGoogleSignInUseCase: IStartGoogleSignInUseCase
  ) =>
  async (
    clientIp?: string
  ): Promise<{
    url: string;
    stateCookie: Cookie;
    codeVerifierCookie: Cookie;
  }> => {
    return await instrumentationService.startSpan(
      { name: 'startGoogleSignIn Controller' },
      async () => {
        if (clientIp) {
          await rateLimiterService.check(OAUTH_START_IP_RATE_LIMIT, clientIp);
          await rateLimiterService.consume(OAUTH_START_IP_RATE_LIMIT, clientIp);
        }

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
