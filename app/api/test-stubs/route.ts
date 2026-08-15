import { NextResponse, type NextRequest } from 'next/server';

import {
  allocateTestStubsRequestSchema,
  type SerializedTestStubDictionary,
} from '@/app/_lib/testing/test-stub-contract';

const stubsBySessionId = new Map<string, SerializedTestStubDictionary>();

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PHASE !== 'test') {
    return new NextResponse(null, { status: 404 });
  }

  const sessionId = req.nextUrl.searchParams.get('sessionId');

  if (sessionId) {
    return NextResponse.json({
      stubs: stubsBySessionId.get(sessionId) ?? null,
    });
  }

  return NextResponse.json({ status: 'ready' });
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PHASE !== 'test') {
    return new NextResponse(null, { status: 404 });
  }

  const { sessionId, data } = allocateTestStubsRequestSchema.parse(
    await req.json()
  );
  stubsBySessionId.set(sessionId, data);

  return NextResponse.json({ message: 'Stub allocated/updated' });
}
