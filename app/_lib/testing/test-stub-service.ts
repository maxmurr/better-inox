import { cookies, headers } from 'next/headers';

import {
  fetchedTestStubsResponseSchema,
  type SerializedTestStubDictionary,
} from './test-stub-contract';

/** Fetches serialized adapter stubs allocated to current test session. */
export async function fetchSerializedTestStubs(): Promise<SerializedTestStubDictionary | null> {
  const sessionId = (await cookies()).get('x-test-session')?.value;

  if (!sessionId) {
    return null;
  }

  const host = (await headers()).get('host');
  const response = await fetch(
    `http://${host}/api/test-stubs?sessionId=${sessionId}`,
    {
      cache: 'no-store',
    }
  );
  const responsePayload = fetchedTestStubsResponseSchema.parse(
    await response.json()
  );

  return responsePayload.stubs;
}
