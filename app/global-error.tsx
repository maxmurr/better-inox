'use client';

import './globals.css';

import { useEffect } from 'react';

import * as Sentry from '@sentry/nextjs';

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
        <main
          id="main-content"
          className="flex max-w-md flex-col items-center gap-4 text-center"
        >
          <h1 className="font-heading text-xl leading-snug font-semibold tracking-tight text-balance">
            Something went wrong
          </h1>
          <p className="text-sm text-pretty text-muted-foreground">
            This page could not be loaded. Try again — if the error keeps coming
            back, reload the page or check again in a few minutes.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors outline-none select-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
          >
            Try Again
          </button>
        </main>
      </body>
    </html>
  );
}
