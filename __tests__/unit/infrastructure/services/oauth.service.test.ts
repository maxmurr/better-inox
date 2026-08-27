import { OAuth2Tokens } from 'arctic';
import { expect, it, vi } from 'vitest';

import { MockInstrumentationService } from '@/src/infrastructure/services/instrumentation.service.mock';
import { OAuthService } from '@/src/infrastructure/services/oauth.service';

it('uses the Google UserInfo picture when the ID token omits it', async () => {
  const encodedHeader = Buffer.from(JSON.stringify({ alg: 'none' })).toString(
    'base64url'
  );
  const encodedClaims = Buffer.from(
    JSON.stringify({
      sub: 'google-user-id',
      email: 'learner@inox.co.th',
      name: 'Test Learner',
      hd: 'inox.co.th',
    })
  ).toString('base64url');
  const tokens = new OAuth2Tokens({
    access_token: 'access-token',
    id_token: `${encodedHeader}.${encodedClaims}.signature`,
  });
  const googleClient = {
    createAuthorizationURL: () =>
      new URL('https://accounts.google.com/o/oauth2/v2/auth'),
    validateAuthorizationCode: async () => tokens,
  };
  const fetchGoogleUserInfo = vi.fn(async () =>
    Response.json({
      picture: 'https://lh3.googleusercontent.com/mock/profile-photo',
    })
  );
  const service = new OAuthService(
    new MockInstrumentationService(),
    googleClient,
    fetchGoogleUserInfo
  );

  const identity = await service.validateGoogleCallback('code', 'verifier');

  expect(identity.avatarUrl).toBe(
    'https://lh3.googleusercontent.com/mock/profile-photo'
  );
  expect(fetchGoogleUserInfo).toHaveBeenCalledWith(
    'https://openidconnect.googleapis.com/v1/userinfo',
    expect.objectContaining({
      headers: { Authorization: 'Bearer access-token' },
    })
  );
});
