import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';

import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { getTodosForUserAdapter } from '@/app/_lib/adapters/todos.adapters';

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '../_components/ui/card';
import { Separator } from '../_components/ui/separator';
import { UserMenu } from '../_components/user-menu';
import { CreateTodo } from './add-todo';
import { getCurrentUser } from './auth';
import { Todos } from './todos';

async function getTodos(sessionId: string | undefined) {
  return await startAppSpanAdapter(
    {
      name: 'getTodos',
      op: 'function.nextjs',
    },
    async () => {
      try {
        return await getTodosForUserAdapter(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }
        await reportAppErrorAdapter(err);
        throw err;
      }
    }
  );
}

export default async function Page() {
  const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;

  const [user, todos] = await Promise.all([
    getCurrentUser(),
    getTodos(sessionId),
  ]);

  return (
    <main id="main-content" className="w-full max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle as="h1">TODOs</CardTitle>
          <CardAction>
            <UserMenu username={user.username} avatarUrl={user.avatarUrl} />
          </CardAction>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-4">
          <CreateTodo />
          <Todos todos={todos} />
        </CardContent>
      </Card>
    </main>
  );
}
