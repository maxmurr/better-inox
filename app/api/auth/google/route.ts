import { NextResponse } from 'next/server';

import { getInjection } from '@/di/container';

export async function GET() {
  const instrumentationService = getInjection('IInstrumentationService');
  return await instrumentationService.startSpan(
    { name: 'GET /api/auth/google', op: 'http.server' },
    async () => {
      try {
        const startGoogleSignInController = getInjection(
          'IStartGoogleSignInController'
        );
        const { url, stateCookie, codeVerifierCookie } =
          await startGoogleSignInController();

        const response = NextResponse.redirect(url);
        for (const cookie of [stateCookie, codeVerifierCookie]) {
          response.cookies.set(cookie.name, cookie.value, cookie.attributes);
        }

        return response;
      } catch (err) {
        const crashReporterService = getInjection('ICrashReporterService');
        crashReporterService.report(err);

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
