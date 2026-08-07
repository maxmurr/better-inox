import { cookies } from 'next/headers';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';

import { getCurrentUserAdapter } from '@/app/_lib/adapters/auth.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';

export async function hasValidSession() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return false;
  }

  return await startAppSpanAdapter(
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
        await reportAppErrorAdapter(err);
        return false;
      }
    }
  );
}
