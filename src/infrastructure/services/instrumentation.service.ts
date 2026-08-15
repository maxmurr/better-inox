import * as Sentry from '@sentry/nextjs';

import type {
  IInstrumentationService,
  InstrumentationSpanOptions,
  ServerActionInstrumentationOptions,
} from '@/src/application/services/instrumentation.service.interface';

export class InstrumentationService implements IInstrumentationService {
  startSpan<T>(options: InstrumentationSpanOptions, callback: () => T): T {
    return Sentry.startSpan(options, callback);
  }

  instrumentServerAction<T>(
    name: string,
    options: ServerActionInstrumentationOptions,
    callback: () => T
  ): Promise<T> {
    return Sentry.withServerActionInstrumentation(name, options, callback);
  }
}
