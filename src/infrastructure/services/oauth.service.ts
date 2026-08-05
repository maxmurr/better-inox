import {
  ArcticFetchError,
  decodeIdToken,
  generateCodeVerifier,
  generateState,
  Google,
  OAuth2RequestError,
} from 'arctic';
import { z } from 'zod';

import { OAuthProviderError } from '@/src/entities/errors/auth';
import { GoogleAuthorizationRequest } from '@/src/entities/models/oauth';
import { GoogleIdentity } from '@/src/entities/models/oauth-account';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IOAuthService } from '@/src/application/services/oauth.service.interface';

import { GOOGLE_SCOPES } from '@/config';

import { env } from '@/env';

const idTokenClaimsSchema = z.object({
  sub: z.string().min(1),
  email: z.email(),
  name: z.string().optional(),
  hd: z.string().optional(),
  picture: z.url().optional(),
});

export class OAuthService implements IOAuthService {
  private _google: Google;

  constructor(
    private readonly _instrumentationService: IInstrumentationService
  ) {
    this._google = new Google(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );
  }

  createGoogleAuthorizationRequest(): GoogleAuthorizationRequest {
    return this._instrumentationService.startSpan(
      { name: 'OAuthService > createGoogleAuthorizationRequest' },
      () => {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = this._google.createAuthorizationURL(
          state,
          codeVerifier,
          GOOGLE_SCOPES
        );

        return { url: url.toString(), state, codeVerifier };
      }
    );
  }

  async validateGoogleCallback(
    code: string,
    codeVerifier: string
  ): Promise<GoogleIdentity> {
    return await this._instrumentationService.startSpan(
      { name: 'OAuthService > validateGoogleCallback' },
      async () => {
        let idToken: string;
        try {
          const tokens = await this._instrumentationService.startSpan(
            { name: 'google.validateAuthorizationCode', op: 'function' },
            () => this._google.validateAuthorizationCode(code, codeVerifier)
          );

          idToken = tokens.idToken();
        } catch (err) {
          if (err instanceof OAuth2RequestError) {
            throw new OAuthProviderError(
              'Google rejected the authorization code',
              { cause: err }
            );
          }
          if (err instanceof ArcticFetchError) {
            throw new OAuthProviderError('Could not reach Google', {
              cause: err,
            });
          }
          throw new OAuthProviderError('Unexpected response from Google', {
            cause: err,
          });
        }

        const { data: claims, error } = idTokenClaimsSchema.safeParse(
          this._instrumentationService.startSpan(
            { name: 'decode id token', op: 'function' },
            () => decodeIdToken(idToken)
          )
        );

        if (error) {
          throw new OAuthProviderError('Google ID token is missing claims', {
            cause: error,
          });
        }

        return {
          providerUserId: claims.sub,
          email: claims.email,
          name: claims.name,
          hd: claims.hd,
          avatarUrl: claims.picture,
        };
      }
    );
  }
}
