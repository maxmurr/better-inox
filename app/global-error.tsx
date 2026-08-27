'use client';

import './globals.css';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

import { PageMessage } from '@/app/_components/page-message';
import { Button } from '@/app/_components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh items-center justify-center bg-muted/80 px-4 font-sans text-foreground antialiased">
        <PageMessage
          title="Something went wrong"
          description="This page could not be loaded. Try again — if the error keeps coming back, reload the page or check again in a few minutes."
        >
          <Button type="button" size="lg" className="px-3" onClick={reset}>
            Try Again
          </Button>
        </PageMessage>
      </body>
    </html>
  );
}
