import {
  OAuthDomainNotAllowedError,
  OAuthStateMismatchError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { Cookie } from '@/src/entities/models/cookie';
import { Session } from '@/src/entities/models/session';
import { User, usernameFromEmail } from '@/src/entities/models/user';
import type { IOAuthAccountsRepository } from '@/src/application/repositories/oauth-accounts.repository.interface';
import type { IUsersRepository } from '@/src/application/repositories/users.repository.interface';
import type { IAuthenticationService } from '@/src/application/services/authentication.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import type { IOAuthService } from '@/src/application/services/oauth.service.interface';
import type { ITransactionManagerService } from '@/src/application/services/transaction-manager.service.interface';

import { ALLOWED_GOOGLE_HD, GOOGLE_PROVIDER_ID } from '@/config';

const MAX_USERNAME_SUFFIX = 9;

export type ISignInWithGoogleUseCase = ReturnType<
  typeof signInWithGoogleUseCase
>;

export const signInWithGoogleUseCase =
  (
    instrumentationService: IInstrumentationService,
    oauthService: IOAuthService,
    authenticationService: IAuthenticationService,
    transactionManagerService: ITransactionManagerService,
    usersRepository: IUsersRepository,
    oauthAccountsRepository: IOAuthAccountsRepository
  ) =>
  (input: {
    code: string;
    state: string;
    storedState: string;
    codeVerifier: string;
  }): Promise<{ session: Session; cookie: Cookie }> => {
    return instrumentationService.startSpan(
      { name: 'signInWithGoogle Use Case', op: 'function' },
      async () => {
        if (
          !input.state ||
          !input.storedState ||
          input.state !== input.storedState
        ) {
          throw new OAuthStateMismatchError('OAuth state does not match');
        }

        const identity = await oauthService.validateGoogleCallback(
          input.code,
          input.codeVerifier
        );

        if (!identity.hd || !ALLOWED_GOOGLE_HD.includes(identity.hd)) {
          throw new OAuthDomainNotAllowedError(
            'Google account is not in an allowed domain'
          );
        }

        const existingUserId =
          await oauthAccountsRepository.getUserIdByProviderAccount(
            GOOGLE_PROVIDER_ID,
            identity.providerUserId
          );

        if (existingUserId) {
          const existingUser = await usersRepository.getUser(existingUserId);

          if (!existingUser) {
            throw new UnauthenticatedError(
              'Linked Google account points at a user that no longer exists'
            );
          }

          const avatarUrl = identity.avatarUrl ?? null;
          const user =
            existingUser.avatar_url === avatarUrl
              ? existingUser
              : await usersRepository.updateAvatarUrl(
                  existingUser.id,
                  avatarUrl
                );

          return await authenticationService.createSession(user);
        }

        const userId = authenticationService.generateUserId();
        const username = await findFreeUsername(
          usersRepository,
          identity.email,
          userId
        );

        const newUser = await transactionManagerService.startTransaction(
          async (tx) => {
            const user = await usersRepository.createOAuthUser(
              { id: userId, username, avatar_url: identity.avatarUrl },
              tx
            );

            await oauthAccountsRepository.createOAuthAccount(
              {
                providerId: GOOGLE_PROVIDER_ID,
                providerUserId: identity.providerUserId,
                userId: user.id,
              },
              tx
            );

            return user;
          }
        );

        return await authenticationService.createSession(newUser);
      }
    );
  };

async function findFreeUsername(
  usersRepository: IUsersRepository,
  email: string,
  userId: User['id']
): Promise<string> {
  const base = usernameFromEmail(email);

  if (!(await usersRepository.getUserByUsername(base))) {
    return base;
  }

  for (let suffix = 2; suffix <= MAX_USERNAME_SUFFIX; suffix++) {
    const candidate = `${base}${suffix}`;
    if (!(await usersRepository.getUserByUsername(candidate))) {
      return candidate;
    }
  }

  return `${base}${userId.slice(0, 6)}`;
}
