import { NextResponse, type NextRequest } from 'next/server';

import {
  OAuthDomainNotAllowedError,
  OAuthProviderError,
  OAuthStateMismatchError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

import {
  GOOGLE_CODE_VERIFIER_COOKIE,
  GOOGLE_STATE_COOKIE,
  POST_SIGN_IN_REDIRECT,
} from '@/config';
import { getInjection } from '@/di/container';

export async function GET(request: NextRequest) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    { name: 'GET /api/auth/google/callback', op: 'http.server' },
    async () => {
      const signInWith = (error?: string) => {
        const path = error
          ? `/sign-in?error=${encodeURIComponent(error)}`
          : '/sign-in';
        return redirectAndClearOAuthCookies(path);
      };

      if (request.nextUrl.searchParams.has('error')) {
        return signInWith();
      }

      try {
        const googleCallbackController = getInjection(
          'IGoogleCallbackController'
        );
        const sessionCookie = await googleCallbackController({
          code: request.nextUrl.searchParams.get('code') ?? undefined,
          state: request.nextUrl.searchParams.get('state') ?? undefined,
          storedState: request.cookies.get(GOOGLE_STATE_COOKIE)?.value,
          codeVerifier: request.cookies.get(GOOGLE_CODE_VERIFIER_COOKIE)?.value,
        });

        const response = redirectAndClearOAuthCookies(POST_SIGN_IN_REDIRECT);
        response.cookies.set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );

        return response;
      } catch (err) {
        if (err instanceof OAuthDomainNotAllowedError) {
          return signInWith('google_domain');
        }

        if (!(
          err instanceof InputParseError ||
          err instanceof OAuthStateMismatchError ||
          err instanceof OAuthProviderError
        )) {
          const crashReporterService = getInjection('ICrashReporterService');
          crashReporterService.report(err);
        }

        return signInWith('google');
      }
    }
  );
}

// Redirects with a relative Location so the browser resolves it against
// whichever host it is already on. Absolute URLs built from `request.url` are
// wrong behind Railway's proxy: route handlers see the container's internal
// address (https://localhost:8080), not the public hostname.
function redirectAndClearOAuthCookies(path: string) {
  const response = new NextResponse(null, {
    status: 307,
    headers: { Location: path },
  });
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  response.cookies.delete(GOOGLE_CODE_VERIFIER_COOKIE);
  return response;
}
