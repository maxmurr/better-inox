import type { OAuthAccount } from '@/src/entities/models/oauth-account';
import { IOAuthAccountsRepository } from '@/src/application/repositories/oauth-accounts.repository.interface';

export class MockOAuthAccountsRepository implements IOAuthAccountsRepository {
  private _oauthAccounts: OAuthAccount[];

  constructor() {
    this._oauthAccounts = [];
  }

  async getUserIdByProviderAccount(
    providerId: string,
    providerUserId: string
  ): Promise<string | undefined> {
    return this._oauthAccounts.find(
      (a) => a.providerId === providerId && a.providerUserId === providerUserId
    )?.userId;
  }

  async createOAuthAccount(input: OAuthAccount): Promise<OAuthAccount> {
    this._oauthAccounts.push(input);
    return input;
  }
}
