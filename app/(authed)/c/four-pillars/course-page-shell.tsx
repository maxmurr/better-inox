import type { Route } from 'next';
import Link from 'next/link';

import { ArrowLeftIcon } from 'lucide-react';

import { buttonVariants } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';

const FOUR_PILLARS_COURSE_TITLE = 'The 4 Pillars of Automated Tests';

type FourPillarsCourseHeaderProps<T extends string> =
  React.ComponentProps<'header'> & {
    actions: React.ReactNode;
    back?: {
      href: Route<T>;
      label: string;
    };
    titleAs?: 'h1' | 'p';
  };

/** Renders the shared four-pillars course title bar and optional back link. */
export function FourPillarsCourseHeader<T extends string = string>({
  actions,
  back,
  className,
  titleAs = 'h1',
  ...props
}: FourPillarsCourseHeaderProps<T>) {
  const Title = titleAs;

  return (
    <header
      className={cn(
        'flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-4',
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-center gap-2">
        {back ? (
          <Link
            href={back.href}
            aria-label={back.label}
            className={buttonVariants({ size: 'icon', variant: 'ghost' })}
          >
            <ArrowLeftIcon aria-hidden />
          </Link>
        ) : null}
        <Title
          className={
            titleAs === 'p'
              ? 'min-w-0 truncate font-heading text-base font-semibold text-foreground sm:text-lg'
              : 'min-w-0 font-heading text-base/snug font-semibold tracking-tight text-balance text-foreground sm:text-lg'
          }
        >
          {FOUR_PILLARS_COURSE_TITLE}
        </Title>
      </div>
      {actions}
    </header>
  );
}

type FourPillarsCourseMainProps = React.ComponentProps<'main'> & {
  maxWidth?: '3xl' | '5xl';
};

/** Renders the shared scrolling content container for four-pillars pages. */
export function FourPillarsCourseMain({
  children,
  className,
  id = 'main-content',
  maxWidth = '3xl',
  ...props
}: FourPillarsCourseMainProps) {
  return (
    <main
      id={id}
      className={cn(
        'min-h-0 flex-1 overflow-y-auto overscroll-contain',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex w-full flex-col gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10',
          maxWidth === '5xl' ? 'max-w-5xl' : 'max-w-3xl'
        )}
      >
        {children}
      </div>
    </main>
  );
}
