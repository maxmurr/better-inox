import { expect, it } from 'vitest';

import {
  AuthenticationError,
  RateLimitError,
} from '@/src/entities/errors/auth';
import { InputParseError } from '@/src/entities/errors/common';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signUpController = getInjection('ISignUpController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns cookie', async () => {
  const { cookie, user } = await signUpController({
    username: 'nikolovlazar',
    password: 'password',
    confirm_password: 'password',
  });

  expect(user).toBeDefined();
  expect(cookie).toMatchObject({
    name: SESSION_COOKIE,
    value: `random_session_id_${user.id}`,
    attributes: {},
  });
});

it('throws for invalid input', () => {
  // empty object
  expect(signUpController({})).rejects.toBeInstanceOf(InputParseError);

  // below min length
  expect(
    signUpController({
      username: 'no',
      password: 'no',
      confirm_password: 'nah',
    })
  ).rejects.toBeInstanceOf(InputParseError);

  // wrong passwords
  expect(
    signUpController({
      username: 'nikolovlazar',
      password: 'password',
      confirm_password: 'passwords',
    })
  ).rejects.toBeInstanceOf(InputParseError);
});

it('throws for existing username', () => {
  expect(
    signUpController({
      username: 'one',
      password: 'doesntmatter',
      confirm_password: 'doesntmatter',
    })
  ).rejects.toBeInstanceOf(AuthenticationError);
});

it('blocks repeated sign ups from the same address', async () => {
  const clientIp = '203.0.113.10';

  for (let attempt = 0; attempt < 5; attempt++) {
    await expect(
      signUpController(
        {
          username: `spammer-${attempt}`,
          password: 'password',
          confirm_password: 'password',
        },
        clientIp
      )
    ).resolves.toBeDefined();
  }

  await expect(
    signUpController(
      {
        username: 'spammer-5',
        password: 'password',
        confirm_password: 'password',
      },
      clientIp
    )
  ).rejects.toBeInstanceOf(RateLimitError);
});

it('counts malformed sign ups against the address', async () => {
  const clientIp = '203.0.113.20';

  for (let attempt = 0; attempt < 5; attempt++) {
    await expect(signUpController({}, clientIp)).rejects.toBeInstanceOf(
      InputParseError
    );
  }

  await expect(signUpController({}, clientIp)).rejects.toBeInstanceOf(
    RateLimitError
  );
});

it('does not limit sign ups when the address is unknown', async () => {
  for (let attempt = 0; attempt < 6; attempt++) {
    await expect(
      signUpController({
        username: `anon-${attempt}`,
        password: 'password',
        confirm_password: 'password',
      })
    ).resolves.toBeDefined();
  }
});
