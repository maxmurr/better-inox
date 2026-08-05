import { expect, it } from 'vitest';

import { InputParseError } from '@/src/entities/errors/common';
import {
  MOCK_OAUTH_CODE_VERIFIER,
  MOCK_OAUTH_STATE,
} from '@/src/infrastructure/services/oauth.service.mock';

import { getInjection } from '@/di/container';

const googleCallbackController = getInjection('IGoogleCallbackController');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns a session cookie', async () => {
  const cookie = await googleCallbackController({
    code: 'callbackuser',
    state: MOCK_OAUTH_STATE,
    storedState: MOCK_OAUTH_STATE,
    codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
  });

  expect(cookie).toHaveProperty('name');
  expect(cookie.value).not.toBe('');
});

it('throws for missing input', () => {
  expect(() =>
    googleCallbackController({
      state: MOCK_OAUTH_STATE,
      storedState: MOCK_OAUTH_STATE,
      codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
    })
  ).rejects.toBeInstanceOf(InputParseError);

  expect(() =>
    googleCallbackController({ code: 'orphan', state: MOCK_OAUTH_STATE })
  ).rejects.toBeInstanceOf(InputParseError);
});
