import { expect, it } from 'vitest';

import { getInjection } from '@/di/container';

const startGoogleSignInUseCase = getInjection('IStartGoogleSignInUseCase');

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it('returns an authorization URL with a state and code verifier', async () => {
  const result = await startGoogleSignInUseCase();

  expect(result.url).toContain('https://accounts.google.com/');
  expect(result.state).not.toBe('');
  expect(result.codeVerifier).not.toBe('');
});
