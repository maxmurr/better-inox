'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { InputParseError, NotFoundError } from '@/src/entities/errors/common';

import { SESSION_COOKIE } from '@/config';

import {
  instrumentServerActionAdapter,
  reportAppErrorAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import {
  bulkUpdateTodosAdapter,
  createTodoAdapter,
  toggleTodoAdapter,
} from '@/app/_lib/adapters/todos.adapters';

export async function createTodo(formData: FormData) {
  return await instrumentServerActionAdapter(
    'createTodo',
    { recordResponse: true },
    async () => {
      try {
        const data = Object.fromEntries(formData.entries());
        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        await createTodoAdapter(data, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a todo' };
        }
        await reportAppErrorAdapter(err);
        return {
          error:
            'An error happened while creating a todo. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}

export async function toggleTodo(todoId: number) {
  return await instrumentServerActionAdapter(
    'toggleTodo',
    { recordResponse: true },
    async () => {
      try {
        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        await toggleTodoAdapter({ todoId }, sessionId);
      } catch (err) {
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to create a todo' };
        }
        if (err instanceof NotFoundError) {
          return { error: 'Todo does not exist' };
        }
        await reportAppErrorAdapter(err);
        return {
          error:
            'An error happened while toggling the todo. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}

export async function bulkUpdate(dirty: number[], deleted: number[]) {
  return await instrumentServerActionAdapter(
    'bulkUpdate',
    { recordResponse: true },
    async () => {
      try {
        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        await bulkUpdateTodosAdapter({ dirty, deleted }, sessionId);
      } catch (err) {
        revalidatePath('/');
        if (err instanceof InputParseError) {
          return { error: err.message };
        }
        if (err instanceof UnauthenticatedError) {
          return { error: 'Must be logged in to bulk update todos' };
        }
        if (err instanceof NotFoundError) {
          return { error: 'Todo does not exist' };
        }
        await reportAppErrorAdapter(err);
        return {
          error:
            'An error happened while bulk updating the todos. The developers have been notified. Please try again later.',
        };
      }

      revalidatePath('/');
      return { success: true };
    }
  );
}
