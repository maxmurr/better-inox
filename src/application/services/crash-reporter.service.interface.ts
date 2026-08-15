/** Reports unexpected failure causes to configured monitoring backend. */
export interface ICrashReporterService {
  report(cause: unknown): string;
}
