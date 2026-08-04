import { expect, it } from 'vitest';

import { AuthenticationError } from '@/src/entities/errors/auth';

import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const usersRepository = getInjection('IUsersRepository');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns session and cookie', async () => {
  const result = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });
  expect(result).toHaveProperty('session');
  expect(result).toHaveProperty('cookie');
  expect(result.session.userId).toBe('1');
});

it('throws for invalid input', () => {
  expect(() =>
    signInUseCase({ username: 'non-existing', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);

  expect(() =>
    signInUseCase({ username: 'one', password: 'password-two' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});

it('throws for a user that has no password', async () => {
  await usersRepository.createOAuthUser({
    id: 'oauth-only',
    username: 'googleonly',
  });

  await expect(
    signInUseCase({ username: 'googleonly', password: 'anything' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});
