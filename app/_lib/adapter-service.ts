import type { z } from 'zod';

import {
  buildStubError,
  stubErrorEnvelopeSchema,
  type StubErrorEnvelope,
  type StubErrorName,
} from './testing/stub-errors';
import { testStubPayloadSchema } from './testing/test-stub-contract';

export type { StubErrorEnvelope } from './testing/stub-errors';

export type StubableAdapter<TArgs extends unknown[], TResult> = ((
  ...args: TArgs
) => Promise<TResult>) & { adapterName: string };

export function stubError(
  name: StubErrorName,
  message: string
): StubErrorEnvelope {
  return { __stubError: { name, message } };
}

type AdapterConfiguration<TArgs extends unknown[], TResult> = {
  name: string;
  callback: (...args: TArgs) => Promise<TResult>;
  stubSchema: z.ZodType<TResult>;
};

export function createAdapter<TArgs extends unknown[], TResult>({
  name,
  callback,
  stubSchema,
}: AdapterConfiguration<TArgs, TResult>): StubableAdapter<TArgs, TResult> {
  const adapter = async (...args: TArgs): Promise<TResult> => {
    if (process.env.NEXT_PUBLIC_PHASE === 'test') {
      const { fetchSerializedTestStubs } =
        await import('./testing/test-stub-service');
      const serializedStubs = await fetchSerializedTestStubs();
      const serializedStub = serializedStubs?.[name];

      if (serializedStub === undefined) {
        throw new Error(`Missing stub for "${name}" adapter`);
      }

      const stubPayload = testStubPayloadSchema.parse(
        JSON.parse(serializedStub)
      );
      const stubErrorResult = stubErrorEnvelopeSchema.safeParse(stubPayload);

      if (stubErrorResult.success) {
        throw buildStubError(
          stubErrorResult.data.__stubError.name,
          stubErrorResult.data.__stubError.message
        );
      }

      return stubSchema.parse(stubPayload);
    }
    return callback(...args);
  };

  adapter.adapterName = name;
  return adapter;
}
