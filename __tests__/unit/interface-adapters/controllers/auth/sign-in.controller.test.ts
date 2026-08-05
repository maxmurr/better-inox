import { expect, it } from 'vitest';

import {
  AuthenticationError,
  RateLimitError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInController = getInjection('ISignInController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('signs in with valid input', () => {
  expect(
    signInController({ username: 'one', password: 'password-one' })
  ).resolves.toMatchObject({
    name: SESSION_COOKIE,
    value: 'random_session_id_1',
    attributes: {},
  });
});

it('throws for invalid input', () => {
  expect(signInController({ username: '' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ password: '' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ username: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(signInController({ password: 'no' })).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(
    signInController({ username: 'one', password: 'short' })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'oneverylongusernamethatmakesnosense',
      password: 'short',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'one',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
  expect(
    signInController({
      username: 'oneverylongusernamethatmakesnosense',
      password: 'oneverylongpasswordthatmakesnosense',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for invalid credentials', async () => {
  await expect(
    signInController({ username: 'nonexisting', password: 'doesntmatter' })
  ).rejects.toBeInstanceOf(AuthenticationError);
  expect(
    signInController({ username: 'one', password: 'wrongpass' })
  ).rejects.toBeInstanceOf(AuthenticationError);
});

it('locks a username out after repeated failures', async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    await expect(
      signInController({ username: 'three', password: 'wrongpass' })
    ).rejects.toBeInstanceOf(AuthenticationError);
  }

  await expect(
    signInController({ username: 'three', password: 'wrongpass' })
  ).rejects.toBeInstanceOf(RateLimitError);

  await expect(
    signInController({ username: 'three', password: 'password-three' })
  ).rejects.toBeInstanceOf(RateLimitError);
});

it('locks out usernames that do not exist', async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    await expect(
      signInController({ username: 'ghost', password: 'wrongpass' })
    ).rejects.toBeInstanceOf(AuthenticationError);
  }

  await expect(
    signInController({ username: 'ghost', password: 'wrongpass' })
  ).rejects.toBeInstanceOf(RateLimitError);
});

it('clears a username counter after a successful sign in', async () => {
  for (let attempt = 0; attempt < 4; attempt++) {
    await expect(
      signInController({ username: 'two', password: 'wrongpass' })
    ).rejects.toBeInstanceOf(AuthenticationError);
  }

  await expect(
    signInController({ username: 'two', password: 'password-two' })
  ).resolves.toMatchObject({ name: SESSION_COOKIE });

  for (let attempt = 0; attempt < 5; attempt++) {
    await expect(
      signInController({ username: 'two', password: 'wrongpass' })
    ).rejects.toBeInstanceOf(AuthenticationError);
  }
});
