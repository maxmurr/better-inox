import { z } from 'zod';

import { cookieSchema } from '@/src/entities/models/cookie';

import { createAdapter } from '../adapter-service';

const currentUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatarUrl: z.string().nullable(),
});

const googleSignInResultSchema = z.object({
  url: z.string(),
  stateCookie: cookieSchema,
  codeVerifierCookie: cookieSchema,
});

export const signOutAdapter = createAdapter({
  name: 'signOut',
  stubSchema: cookieSchema,
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISignOutController')(sessionId);
  },
});

export const getCurrentUserAdapter = createAdapter({
  name: 'getCurrentUser',
  stubSchema: currentUserSchema,
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetCurrentUserController')(sessionId);
  },
});

export const startGoogleSignInAdapter = createAdapter({
  name: 'startGoogleSignIn',
  stubSchema: googleSignInResultSchema,
  callback: async (clientIp?: string) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IStartGoogleSignInController')(clientIp);
  },
});

export const googleCallbackAdapter = createAdapter({
  name: 'googleCallback',
  stubSchema: cookieSchema,
  callback: async (
    input: {
      code?: string;
      state?: string;
      storedState?: string;
      codeVerifier?: string;
    },
    clientIp?: string
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGoogleCallbackController')(input, clientIp);
  },
});
