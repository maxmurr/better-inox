import { cookies } from 'next/headers';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

import { getCurrentUserAdapter } from '@/app/_lib/adapters/auth.adapters';

// Validates rather than sniffing the cookie, so an expired or forged value
// leaves the visitor on the auth page. `proxy.ts` cannot do this — it runs on
// the edge with no session store, and bouncing on mere cookie presence would
// ping-pong with the render-time redirect in `(authed)/auth.ts`.
export async function hasValidSession() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return false;
  }

  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    { name: 'hasValidSession', op: 'function.nextjs' },
    async () => {
      try {
        await getCurrentUserAdapter(sessionId);
        return true;
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          return false;
        }
        // Degrade to showing the form: the visitor still needs a way in, and
        // the sign-in attempt itself will surface a real failure.
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
        return false;
      }
    }
  );
}
