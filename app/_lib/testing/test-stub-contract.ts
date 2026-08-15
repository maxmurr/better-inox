import { z } from 'zod';

/** Serialized test stub values keyed by adapter name. */
export const serializedTestStubDictionarySchema = z.record(
  z.string(),
  z.string()
);

/** Serialized test stub values stored for one browser session. */
export type SerializedTestStubDictionary = z.infer<
  typeof serializedTestStubDictionarySchema
>;

/** Request contract for allocating test stubs to one browser session. */
export const allocateTestStubsRequestSchema = z.object({
  sessionId: z.string().min(1),
  data: serializedTestStubDictionarySchema,
});

/** Response contract for retrieving one browser session's test stubs. */
export const fetchedTestStubsResponseSchema = z.object({
  stubs: serializedTestStubDictionarySchema.nullable(),
});

/** JSON value contract decoded before adapter-specific stub parsing. */
export const testStubPayloadSchema = z.json();

/** Serializes one adapter stub while rejecting unsupported values. */
export function serializeTestStubValue<T>(
  adapterName: string,
  value: T
): string {
  const serializedValue = JSON.stringify(value);

  if (serializedValue === undefined) {
    throw new Error(
      `Test stub serialization failed for adapter "${adapterName}"`
    );
  }

  return serializedValue;
}
