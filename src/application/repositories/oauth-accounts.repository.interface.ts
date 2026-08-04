import type { OAuthAccount } from '@/src/entities/models/oauth-account';
import type { ITransaction } from '@/src/entities/models/transaction.interface';

export interface IOAuthAccountsRepository {
  getUserIdByProviderAccount(
    providerId: string,
    providerUserId: string
  ): Promise<string | undefined>;
  createOAuthAccount(
    input: OAuthAccount,
    tx?: ITransaction
  ): Promise<OAuthAccount>;
}
