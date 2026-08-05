import { createAdapter } from '../adapter-service';

export const getTodosForUserAdapter = createAdapter({
  name: 'getTodosForUser',
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetTodosForUserController')(sessionId);
  },
});
