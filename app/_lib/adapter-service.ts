import type { StubErrorName } from './testing/stub-errors';

export type StubableAdapter<TArgs extends unknown[], TResult> = ((
  ...args: TArgs
) => Promise<TResult>) & { adapterName: string };

export type StubErrorEnvelope = {
  __stubError: { name: StubErrorName; message: string };
};

export function stubError(
  name: StubErrorName,
  message: string
): StubErrorEnvelope {
  return { __stubError: { name, message } };
}

function isStubError(value: unknown): value is StubErrorEnvelope {
  return typeof value === 'object' && value !== null && '__stubError' in value;
}

export function createAdapter<TArgs extends unknown[], TResult>({
  name,
  callback,
}: {
  name: string;
  callback: (...args: TArgs) => Promise<TResult>;
}): StubableAdapter<TArgs, TResult> {
  const adapter = async (...args: TArgs): Promise<TResult> => {
    if (process.env.NEXT_PUBLIC_PHASE === 'test') {
      const { fetchStubs } = await import('./testing/test-stub-service');
      const stubs = await fetchStubs();

      if (!stubs || !Object.hasOwn(stubs, name)) {
        throw new Error(`Missing stub for "${name}" adapter`);
      }

      const stub = stubs[name];

      if (isStubError(stub)) {
        const { buildStubError } = await import('./testing/stub-errors');
        throw buildStubError(stub.__stubError.name, stub.__stubError.message);
      }

      return stub as TResult;
    }
    return callback(...args);
  };

  adapter.adapterName = name;
  return adapter;
}
