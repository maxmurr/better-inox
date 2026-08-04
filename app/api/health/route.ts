import { getInjection } from '@/di/container';

export const dynamic = 'force-dynamic';

const PING_TIMEOUT_MS = 2000;

export async function GET() {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const databaseHealthService = getInjection('IDatabaseHealthService');

    await Promise.race([
      databaseHealthService.ping(),
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
