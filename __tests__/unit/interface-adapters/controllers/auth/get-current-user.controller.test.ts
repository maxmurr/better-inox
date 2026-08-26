import { expect, it } from 'vitest';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');
const getCurrentUserController = getInjection('IGetCurrentUserController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns the username and avatar of the signed-in user', async () => {
  const { session } = await signInWithGoogleUseCase({
    code: 'profile-view',
    state: MOCK_OAUTH_STATE,
    storedState: MOCK_OAUTH_STATE,
    codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
  });

  await expect(getCurrentUserController(session.id)).resolves.toStrictEqual({
    id: session.userId,
    username: 'profile-view',
    avatarUrl: 'https://lh3.googleusercontent.com/mock/profile-view',
  });
});

it('throws when unauthenticated', async () => {
  await expect(getCurrentUserController('')).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
  await expect(getCurrentUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
});
