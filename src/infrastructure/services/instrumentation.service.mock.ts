import type {
  IInstrumentationService,
  InstrumentationSpanOptions,
  ServerActionInstrumentationOptions,
} from '@/src/application/services/instrumentation.service.interface';

export class MockInstrumentationService implements IInstrumentationService {
  startSpan<T>(_options: InstrumentationSpanOptions, callback: () => T): T {
    return callback();
  }

  async instrumentServerAction<T>(
    _name: string,
    _options: ServerActionInstrumentationOptions,
    callback: () => T
  ): Promise<T> {
    return callback();
  }
}
