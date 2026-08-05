import { createContainer } from '@evyweb/ioctopus';

import { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';

import { createAuthenticationModule } from '@/di/modules/authentication.module';
import { createTransactionManagerModule } from '@/di/modules/database.module';
import { createMonitoringModule } from '@/di/modules/monitoring.module';
import { createOAuthModule } from '@/di/modules/oauth.module';
import { createRateLimitModule } from '@/di/modules/rate-limit.module';
import { createTodosModule } from '@/di/modules/todos.module';
import { createUsersModule } from '@/di/modules/users.module';
import { DI_RETURN_TYPES, DI_SYMBOLS } from '@/di/types';

const ApplicationContainer = createContainer();

ApplicationContainer.load(Symbol('MonitoringModule'), createMonitoringModule());
ApplicationContainer.load(Symbol('RateLimitModule'), createRateLimitModule());
ApplicationContainer.load(
  Symbol('TransactionManagerModule'),
  createTransactionManagerModule()
);
ApplicationContainer.load(
  Symbol('AuthenticationModule'),
  createAuthenticationModule()
);
ApplicationContainer.load(Symbol('UsersModule'), createUsersModule());
ApplicationContainer.load(Symbol('OAuthModule'), createOAuthModule());
ApplicationContainer.load(Symbol('TodosModule'), createTodosModule());

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  const instrumentationService =
    ApplicationContainer.get<IInstrumentationService>(
      DI_SYMBOLS.IInstrumentationService
    );

  return instrumentationService.startSpan(
    {
      name: '(di) getInjection',
      op: 'function',
      attributes: { symbol: symbol.toString() },
    },
    () => ApplicationContainer.get(DI_SYMBOLS[symbol])
  );
}
