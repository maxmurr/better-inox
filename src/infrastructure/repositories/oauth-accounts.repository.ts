import { and, eq } from 'drizzle-orm';

import { DatabaseOperationError } from '@/src/entities/errors/common';
import type { OAuthAccount } from '@/src/entities/models/oauth-account';
import { IOAuthAccountsRepository } from '@/src/application/repositories/oauth-accounts.repository.interface';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { db, Transaction } from '@/drizzle';
import { oauthAccounts } from '@/drizzle/schema';

export class OAuthAccountsRepository implements IOAuthAccountsRepository {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async getUserIdByProviderAccount(
    providerId: string,
    providerUserId: string
  ): Promise<string | undefined> {
    return await this.instrumentationService.startSpan(
      { name: 'OAuthAccountsRepository > getUserIdByProviderAccount' },
      async () => {
        try {
          const query = db.query.oauthAccounts.findFirst({
            where: and(
              eq(oauthAccounts.providerId, providerId),
              eq(oauthAccounts.providerUserId, providerUserId)
            ),
          });

          const oauthAccount = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          return oauthAccount?.userId;
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot get OAuth account.', {
            cause: err,
          });
        }
      }
    );
  }

  async createOAuthAccount(
    input: OAuthAccount,
    tx?: Transaction
  ): Promise<OAuthAccount> {
    const invoker = tx ?? db;

    return await this.instrumentationService.startSpan(
      { name: 'OAuthAccountsRepository > createOAuthAccount' },
      async () => {
        try {
          const query = invoker.insert(oauthAccounts).values(input).returning();

          const [created] = await this.instrumentationService.startSpan(
            {
              name: query.toSQL().sql,
              op: 'db.query',
              attributes: { 'db.system': 'sqlite' },
            },
            () => query.execute()
          );

          if (created) {
            return created;
          } else {
            throw new DatabaseOperationError('Cannot create OAuth account.');
          }
        } catch (err) {
          this.crashReporterService.report(err);
          if (err instanceof DatabaseOperationError) {
            throw err;
          }
          throw new DatabaseOperationError('Cannot create OAuth account.', {
            cause: err,
          });
        }
      }
    );
  }
}
