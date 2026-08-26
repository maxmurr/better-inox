'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';
import { Cookie } from '@/src/entities/models/cookie';

import { SESSION_COOKIE } from '@/config';

import { signOutAdapter } from '@/app/_lib/adapters/auth.adapters';
import {
  instrumentServerActionAdapter,
  reportAppErrorAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';

export async function signOut() {
  return await instrumentServerActionAdapter(
    'signOut',
    { recordResponse: true },
    async () => {
      const cookiesStore = await cookies();
      const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

      let blankCookie: Cookie;
      try {
        blankCookie = await signOutAdapter(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof InputParseError
        ) {
          redirect('/sign-in');
        }
        await reportAppErrorAdapter(err);
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
