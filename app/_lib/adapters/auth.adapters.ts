import { createAdapter } from '../adapter-service';

export const signInAdapter = createAdapter({
  name: 'signIn',
  callback: async (
    input: { username?: string; password?: string },
    clientIp?: string
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISignInController')(input, clientIp);
  },
});

export const signUpAdapter = createAdapter({
  name: 'signUp',
  callback: async (
    input: {
      username?: string;
      password?: string;
      confirm_password?: string;
    },
    clientIp?: string
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISignUpController')(input, clientIp);
  },
});

export const signOutAdapter = createAdapter({
  name: 'signOut',
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ISignOutController')(sessionId);
  },
});

export const getCurrentUserAdapter = createAdapter({
  name: 'getCurrentUser',
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetCurrentUserController')(sessionId);
  },
});

export const startGoogleSignInAdapter = createAdapter({
  name: 'startGoogleSignIn',
  callback: async (clientIp?: string) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IStartGoogleSignInController')(clientIp);
  },
});

export const googleCallbackAdapter = createAdapter({
  name: 'googleCallback',
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
