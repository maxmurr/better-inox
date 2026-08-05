import { expect, it } from 'vitest';

import {
  OAuthDomainNotAllowedError,
  OAuthProviderError,
  OAuthStateMismatchError,
} from '@/src/entities/errors/auth';
import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_FOREIGN_DOMAIN_CODE,
  MOCK_OAUTH_INVALID_CODE,
  MOCK_OAUTH_PERSONAL_ACCOUNT_CODE,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');
const usersRepository = getInjection('IUsersRepository');

const validCallback = (code: string) => ({
  code,
  state: MOCK_OAUTH_STATE,
  storedState: MOCK_OAUTH_STATE,
  codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('creates a user and a session for an unseen Google account', async () => {
  const result = await signInWithGoogleUseCase(validCallback('newcomer'));

  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');

  const user = await usersRepository.getUser(result.session.userId);
  expect(user?.username).toBe('newcomer');
  expect(user?.password_hash).toBeNull();
});

it('stores the avatar URL from the Google identity', async () => {
  const result = await signInWithGoogleUseCase(validCallback('with-avatar'));

  const user = await usersRepository.getUser(result.session.userId);
  expect(user?.avatar_url).toBe(
    'https://lh3.googleusercontent.com/mock/with-avatar'
  );
});

it('refreshes a stale avatar URL when the account returns', async () => {
  const first = await signInWithGoogleUseCase(validCallback('stale-avatar'));
  await usersRepository.updateAvatarUrl(
    first.session.userId,
    'https://lh3.googleusercontent.com/mock/expired'
  );

  const second = await signInWithGoogleUseCase(validCallback('stale-avatar'));

  const user = await usersRepository.getUser(second.session.userId);
  expect(user?.avatar_url).toBe(
    'https://lh3.googleusercontent.com/mock/stale-avatar'
  );
});

it('reuses the linked user when the same Google account returns', async () => {
  const first = await signInWithGoogleUseCase(validCallback('returning'));
  const second = await signInWithGoogleUseCase(validCallback('returning'));

  expect(second.session.userId).toBe(first.session.userId);

  const user = await usersRepository.getUser(second.session.userId);
  expect(user?.username).toBe('returning');
});

it('suffixes the username when the email local-part is taken', async () => {
  const result = await signInWithGoogleUseCase(validCallback('one'));

  const user = await usersRepository.getUser(result.session.userId);
  expect(user?.username).toBe('one2');
});

it('throws when the returned state does not match the stored state', async () => {
  await expect(
    signInWithGoogleUseCase({
      ...validCallback('tampered'),
      storedState: 'a_different_state',
    })
  ).rejects.toBeInstanceOf(OAuthStateMismatchError);

  await expect(
    signInWithGoogleUseCase({ ...validCallback('tampered'), storedState: '' })
  ).rejects.toBeInstanceOf(OAuthStateMismatchError);
});

it('throws when the provider rejects the authorization code', async () => {
  await expect(
    signInWithGoogleUseCase(validCallback(MOCK_OAUTH_INVALID_CODE))
  ).rejects.toBeInstanceOf(OAuthProviderError);
});

it('throws for a Workspace account outside the allowed domains', async () => {
  await expect(
    signInWithGoogleUseCase(validCallback(MOCK_OAUTH_FOREIGN_DOMAIN_CODE))
  ).rejects.toBeInstanceOf(OAuthDomainNotAllowedError);
});

it('throws for a personal account, which carries no hosted domain', async () => {
  await expect(
    signInWithGoogleUseCase(validCallback(MOCK_OAUTH_PERSONAL_ACCOUNT_CODE))
  ).rejects.toBeInstanceOf(OAuthDomainNotAllowedError);
});

it('creates no user for a rejected domain', async () => {
  await expect(
    signInWithGoogleUseCase(validCallback(MOCK_OAUTH_FOREIGN_DOMAIN_CODE))
  ).rejects.toThrow();

  const user = await usersRepository.getUserByUsername(
    MOCK_OAUTH_FOREIGN_DOMAIN_CODE
  );
  expect(user).toBeUndefined();
});
