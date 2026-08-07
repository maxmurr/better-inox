import { createAdapter } from '../adapter-service';

export const createTodoAdapter = createAdapter({
  name: 'createTodo',
  callback: async (input: { todo?: string }, sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('ICreateTodoController')(input, sessionId);
  },
});

export const toggleTodoAdapter = createAdapter({
  name: 'toggleTodo',
  callback: async (
    input: { todoId?: number },
    sessionId: string | undefined
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IToggleTodoController')(input, sessionId);
  },
});

export const bulkUpdateTodosAdapter = createAdapter({
  name: 'bulkUpdateTodos',
  callback: async (
    input: { dirty: number[]; deleted: number[] },
    sessionId: string | undefined
  ) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IBulkUpdateController')(input, sessionId);
  },
});

export const getTodosForUserAdapter = createAdapter({
  name: 'getTodosForUser',
  callback: async (sessionId: string | undefined) => {
    const { getInjection } = await import('@/di/container');
    return getInjection('IGetTodosForUserController')(sessionId);
  },
});
