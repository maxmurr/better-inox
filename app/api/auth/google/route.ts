import { NextResponse, type NextRequest } from 'next/server';

import { getInjection } from '@/di/container';

export async function GET(request: NextRequest) {
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

        return NextResponse.redirect(
          new URL('/sign-in?error=google', request.url)
        );
      }
    }
  );
}
