import { NextResponse, type NextRequest } from 'next/server';

import { RateLimitError } from '@/src/entities/errors/auth';

import { startGoogleSignInAdapter } from '@/app/_lib/adapters/auth.adapters';
import {
  reportAppErrorAdapter,
  startAppSpanAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';
import { clientIpFrom } from '@/app/client-ip';

export async function GET(request: NextRequest) {
  return await startAppSpanAdapter(
    { name: 'GET /api/auth/google', op: 'http.server' },
    async () => {
      try {
        const { url, stateCookie, codeVerifierCookie } =
          await startGoogleSignInAdapter(clientIpFrom(request.headers));

        const response = NextResponse.redirect(url);
        for (const cookie of [stateCookie, codeVerifierCookie]) {
          response.cookies.set(cookie.name, cookie.value, cookie.attributes);
        }

        return response;
      } catch (err) {
        if (err instanceof RateLimitError) {
          return new NextResponse(null, {
            status: 307,
            headers: {
              Location: '/sign-in?error=rate_limit',
              'Retry-After': String(err.retryAfterSeconds),
            },
          });
        }

        await reportAppErrorAdapter(err);

        // Relative Location: see the note in the callback route about
        // `request.url` resolving to the container address behind the proxy.
        return new NextResponse(null, {
          status: 307,
          headers: { Location: '/sign-in?error=google' },
        });
      }
    }
  );
}
