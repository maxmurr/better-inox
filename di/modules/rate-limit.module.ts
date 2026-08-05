import { createModule } from '@evyweb/ioctopus';

import { RateLimiterService } from '@/src/infrastructure/services/rate-limiter.service';
import { MockRateLimiterService } from '@/src/infrastructure/services/rate-limiter.service.mock';

import { DI_SYMBOLS } from '@/di/types';

export function createRateLimitModule() {
  const rateLimitModule = createModule();

  if (process.env.NODE_ENV === 'test') {
    rateLimitModule
      .bind(DI_SYMBOLS.IRateLimiterService)
      .toClass(MockRateLimiterService);
  } else {
    rateLimitModule
      .bind(DI_SYMBOLS.IRateLimiterService)
      .toClass(RateLimiterService, [
        DI_SYMBOLS.IInstrumentationService,
        DI_SYMBOLS.ICrashReporterService,
      ]);
  }

  return rateLimitModule;
}
