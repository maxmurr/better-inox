import type { Metadata } from 'next';
import Link from 'next/link';

import { POST_SIGN_IN_REDIRECT } from '@/config';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex max-w-md flex-col items-center gap-4 px-4 text-center"
    >
      <h1 className="font-heading text-xl/snug font-semibold tracking-tight text-balance">
        Page not found
      </h1>
      <p className="text-sm text-pretty text-muted-foreground">
        This page does not exist, or it moved somewhere else.
      </p>
      <Link
        href={POST_SIGN_IN_REDIRECT}
        className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors outline-none select-none hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px"
      >
        Back to the course
      </Link>
    </main>
  );
}
