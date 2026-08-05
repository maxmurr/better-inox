'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  AuthenticationError,
  RateLimitError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';

import { POST_SIGN_IN_REDIRECT, SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

import { clientIpFrom } from '@/app/client-ip';

function tooManyAttempts(err: RateLimitError) {
  const minutes = Math.max(1, Math.ceil(err.retryAfterSeconds / 60));

  return {
    error: `Too many attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`,
  };
}

export async function signUp(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signUp',
    { recordResponse: true },
    async () => {
      const username = formData.get('username')?.toString();
      const password = formData.get('password')?.toString();
      const confirmPassword = formData.get('confirm_password')?.toString();

      const clientIp = clientIpFrom(await headers());

      let sessionCookie: Cookie;
      try {
        const signUpController = getInjection('ISignUpController');
        const { cookie } = await signUpController(
          {
            username,
            password,
            confirm_password: confirmPassword,
          },
          clientIp
        );
        sessionCookie = cookie;
      } catch (err) {
        if (err instanceof RateLimitError) {
          return tooManyAttempts(err);
        }
        if (err instanceof InputParseError) {
          return {
            error:
              'Use a username of 3–31 characters and a password of 6–31 characters.',
          };
        }
        if (err instanceof AuthenticationError) {
          return {
            error: err.message,
          };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);

        return {
          error:
            'An error happened. The developers have been notified. Please try again later.',
        };
      }

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      redirect(POST_SIGN_IN_REDIRECT);
    }
  );
}

export async function signIn(formData: FormData) {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signIn',
    { recordResponse: true },
    async () => {
      const username = formData.get('username')?.toString();
      const password = formData.get('password')?.toString();

      const clientIp = clientIpFrom(await headers());

      let sessionCookie: Cookie;
      try {
        const signInController = getInjection('ISignInController');
        sessionCookie = await signInController(
          { username, password },
          clientIp
        );
      } catch (err) {
        if (err instanceof RateLimitError) {
          return tooManyAttempts(err);
        }
        if (
          err instanceof InputParseError ||
          err instanceof AuthenticationError
        ) {
          return {
            error: 'Incorrect username or password',
          };
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return {
          error:
            'An error happened. The developers have been notified. Please try again later.',
        };
      }

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      redirect(POST_SIGN_IN_REDIRECT);
    }
  );
}

export async function signOut() {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.instrumentServerAction(
    'signOut',
    { recordResponse: true },
    async () => {
      const cookiesStore = await cookies();
      const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

      let blankCookie: Cookie;
      try {
        const signOutController = getInjection('ISignOutController');
        blankCookie = await signOutController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        throw err;
      }

      cookiesStore.set(
        blankCookie.name,
        blankCookie.value,
        blankCookie.attributes
      );

      redirect('/sign-in');
    }
  );
}
