import { OAuthProviderError } from '@/src/entities/errors/auth';
import { GoogleAuthorizationRequest } from '@/src/entities/models/oauth';
import { GoogleIdentity } from '@/src/entities/models/oauth-account';
import { IOAuthService } from '@/src/application/services/oauth.service.interface';

import { ALLOWED_GOOGLE_HD } from '@/config';

export const MOCK_OAUTH_STATE = 'mock_state';
export const MOCK_OAUTH_CODE_VERIFIER = 'mock_code_verifier';
export const MOCK_OAUTH_INVALID_CODE = 'invalid_code';

export const MOCK_OAUTH_FOREIGN_DOMAIN_CODE = 'foreign_domain';
export const MOCK_OAUTH_PERSONAL_ACCOUNT_CODE = 'personal_account';

export class MockOAuthService implements IOAuthService {
  createGoogleAuthorizationRequest(): GoogleAuthorizationRequest {
    return {
      url: 'https://accounts.google.com/o/oauth2/v2/auth?mock=1',
      state: MOCK_OAUTH_STATE,
      codeVerifier: MOCK_OAUTH_CODE_VERIFIER,
    };
  }

  async validateGoogleCallback(code: string): Promise<GoogleIdentity> {
    if (code === MOCK_OAUTH_INVALID_CODE) {
      throw new OAuthProviderError('Google rejected the authorization code');
    }

    return {
      providerUserId: code,
      email: `${code}@example.com`,
      name: code,
      hd: mockHostedDomain(code),
      avatarUrl: `https://lh3.googleusercontent.com/mock/${code}`,
    };
  }
}

function mockHostedDomain(code: string): string | undefined {
  if (code === MOCK_OAUTH_PERSONAL_ACCOUNT_CODE) {
    return undefined;
  }
  if (code === MOCK_OAUTH_FOREIGN_DOMAIN_CODE) {
    return 'not-allowed.example';
  }
  return ALLOWED_GOOGLE_HD[0];
}
