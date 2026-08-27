import type { Metadata } from 'next';
import Link from 'next/link';

import { POST_SIGN_IN_REDIRECT } from '@/config';

import { PageMessage } from '@/app/_components/page-message';
import { buttonVariants } from '@/app/_components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <PageMessage
      title="Page not found"
      description="This page does not exist, or it moved somewhere else."
      className="px-4"
    >
      <Link
        href={POST_SIGN_IN_REDIRECT}
        className={buttonVariants({ size: 'lg', className: 'px-3' })}
      >
        Back to the course
      </Link>
    </PageMessage>
  );
}
