import { expect, it } from 'vitest';

import { InputParseError } from '@/src/entities/errors/common';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInUseCase = getInjection('ISignInUseCase');
const signOutController = getInjection('ISignOutController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInUseCase({
    username: 'one',
    password: 'password-one',
  });

  expect(signOutController(session.id)).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: '',
    attributes: {},
  });
});

it('throws for invalid input', () => {
  expect(signOutController(undefined)).rejects.toBeInstanceOf(InputParseError);
});
