import { expect, it } from 'vitest';

import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { SESSION_COOKIE } from '@/config';
import { getInjection } from '@/di/container';

const signInWithGoogleUseCase = getInjection('ISignInWithGoogleUseCase');
const signOutUseCase = getInjection('ISignOutUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns blank cookie', async () => {
  const { session } = await signInWithGoogleUseCase({
    code: 'sign-out-use-case',
    state: MOCK_OAUTH_STATE,
    storedState: MOCK_OAUTH_STATE,
    codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
  });

  expect(signOutUseCase(session.id)).resolves.toMatchObject({
    blankCookie: {
      name: SESSION_COOKIE,
      value: '',
      attributes: {},
    },
  });
});
