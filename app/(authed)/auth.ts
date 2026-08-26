import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { UnauthenticatedError } from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';

import { getCurrentUserAdapter } from '@/app/_lib/adapters/auth.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';

export const getCurrentUser = cache(async () => {
  return await startAppSpanAdapter(
    {
      name: 'getCurrentUser',
      op: 'function.nextjs',
    },
    async () => {
      const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
      try {
        return await getCurrentUserAdapter(sessionId);
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
          redirect('/sign-in');
        }
        await reportAppErrorAdapter(err);
        throw err;
      }
    }
  );
});
