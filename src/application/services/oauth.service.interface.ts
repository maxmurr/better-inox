import { GoogleAuthorizationRequest } from '@/src/entities/models/oauth';
import { GoogleIdentity } from '@/src/entities/models/oauth-account';

export interface IOAuthService {
  createGoogleAuthorizationRequest(): GoogleAuthorizationRequest;
  validateGoogleCallback(
    code: string,
    codeVerifier: string
  ): Promise<GoogleIdentity>;
}
