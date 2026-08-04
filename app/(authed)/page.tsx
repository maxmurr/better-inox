import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

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
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    {
      name: 'getTodos',
      op: 'function.nextjs',
    },
    async () => {
      try {
        const getTodosForUserController = getInjection(
          'IGetTodosForUserController'
        );
        return await getTodosForUserController(sessionId);
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          redirect('/sign-in');
        }
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);
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
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>TODOs</CardTitle>
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
  );
}
