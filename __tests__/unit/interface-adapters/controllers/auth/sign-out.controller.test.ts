import { expect, it } from 'vitest';

import { InputParseError } from '@/src/entities/errors/common';
import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');
const signOutController = getInjection('ISignOutController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInWithGoogleUseCase({
    code: 'sign-out-controller',
    state: MOCK_OAUTH_STATE,
    storedState: MOCK_OAUTH_STATE,
    codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
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
