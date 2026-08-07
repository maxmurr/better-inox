import { pingDatabaseAdapter } from '@/app/_lib/adapters/health.adapters';

export const dynamic = 'force-dynamic';

const PING_TIMEOUT_MS = 2000;

export async function GET() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    await Promise.race([
      pingDatabaseAdapter(),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error('database ping timed out')),
          PING_TIMEOUT_MS
        );
      }),
    ]);

    return Response.json({ status: 'ok' });
  } catch {
    return Response.json(
      { status: 'error', database: 'unreachable' },
      { status: 503 }
    );
  } finally {
    clearTimeout(timer);
  }
}
