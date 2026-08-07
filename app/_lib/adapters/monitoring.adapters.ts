type AppSpanOptions = {
  name: string;
  op?: string;
  attributes?: Record<string, unknown>;
};

export async function startAppSpanAdapter<T>(
  options: AppSpanOptions,
  callback: () => Promise<T>
): Promise<T> {
  const { getInjection } = await import('@/di/container');
  return await getInjection('IInstrumentationService').startSpan(
    options,
    callback
  );
}

export async function instrumentServerActionAdapter<T>(
  name: string,
  options: Record<string, unknown>,
  callback: () => Promise<T>
): Promise<T> {
  const { getInjection } = await import('@/di/container');
  return await getInjection('IInstrumentationService').instrumentServerAction(
    name,
    options,
    callback
  );
}

export async function reportAppErrorAdapter(error: unknown): Promise<void> {
  const { getInjection } = await import('@/di/container');
  getInjection('ICrashReporterService').report(error);
}
