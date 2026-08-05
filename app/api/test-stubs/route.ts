import { NextRequest, NextResponse } from 'next/server';

const stubs = new Map<string, Record<string, unknown>>();

export async function GET(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PHASE !== 'test') {
    return new NextResponse(null, { status: 404 });
  }

  const sessionId = req.nextUrl.searchParams.get('sessionId');

  if (sessionId) {
    return NextResponse.json({ stubs: stubs.get(sessionId) ?? null });
  }

  return NextResponse.json({ status: 'ready' });
}

export async function POST(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_PHASE !== 'test') {
    return new NextResponse(null, { status: 404 });
  }

  const json: { sessionId: string; data: Record<string, unknown> } =
    await req.json();
  const { sessionId, data } = json;

  stubs.set(sessionId, data);

  return NextResponse.json({ message: 'Stub allocated/updated' });
}
