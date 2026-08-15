import type { DI_RETURN_TYPES } from '@/di/types';

type InstrumentationService = DI_RETURN_TYPES['IInstrumentationService'];
type InstrumentationSpanOptions = Parameters<
  InstrumentationService['startSpan']
>[0];
type ServerActionInstrumentationOptions = Parameters<
  InstrumentationService['instrumentServerAction']
>[1];

export async function startAppSpanAdapter<T>(
  options: InstrumentationSpanOptions,
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
  options: ServerActionInstrumentationOptions,
  callback: () => Promise<T>
): Promise<T> {
  const { getInjection } = await import('@/di/container');
  return await getInjection('IInstrumentationService').instrumentServerAction(
    name,
    options,
    callback
  );
}

export async function reportAppErrorAdapter(cause: unknown): Promise<void> {
  const { getInjection } = await import('@/di/container');
  getInjection('ICrashReporterService').report(cause);
}
