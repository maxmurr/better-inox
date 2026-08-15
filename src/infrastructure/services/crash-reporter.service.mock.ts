import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';

export class MockCrashReporterService implements ICrashReporterService {
  report(cause: unknown): string {
    void cause;
    return 'errorId';
  }
}
