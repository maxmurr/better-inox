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
        const url = new URL('/sign-in', request.url);
        if (error) {
          url.searchParams.set('error', error);
        }
        return redirectAndClearOAuthCookies(url);
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

        const response = redirectAndClearOAuthCookies(
          new URL(POST_SIGN_IN_REDIRECT, request.url)
        );
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

function redirectAndClearOAuthCookies(url: URL) {
  const response = NextResponse.redirect(url);
  response.cookies.delete(GOOGLE_STATE_COOKIE);
  response.cookies.delete(GOOGLE_CODE_VERIFIER_COOKIE);
  return response;
}
