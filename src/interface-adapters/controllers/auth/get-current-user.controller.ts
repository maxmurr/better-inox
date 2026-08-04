import { UnauthenticatedError } from '@/src/entities/errors/auth';
import { User } from '@/src/entities/models/user';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

function presenter(
  user: User,
  instrumentationService: IInstrumentationService
) {
  return instrumentationService.startSpan(
    { name: 'getCurrentUser Presenter', op: 'serialize' },
    () => ({
      username: user.username,
      avatarUrl: user.avatar_url,
    })
  );
}

export type IGetCurrentUserController = ReturnType<
  typeof getCurrentUserController
>;

export const getCurrentUserController =
  (
    instrumentationService: IInstrumentationService,
    authenticationService: IAuthenticationService
  ) =>
  async (
    sessionId: string | undefined
  ): Promise<ReturnType<typeof presenter>> => {
    return await instrumentationService.startSpan(
      { name: 'getCurrentUser Controller' },
      async () => {
        if (!sessionId) {
          throw new UnauthenticatedError('Must be logged in to view a profile');
        }

        const { user } = await authenticationService.validateSession(sessionId);

        return presenter(user, instrumentationService);
      }
    );
  };
