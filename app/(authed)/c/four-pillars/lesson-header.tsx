import Link from 'next/link';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChartNoAxesColumnIncreasingIcon,
} from 'lucide-react';

import { Button, buttonVariants } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';
import {
  lessonHref,
  type LessonResultsHref,
} from '@/app/(authed)/c/four-pillars/course-href';
import type {
  CourseLesson,
  FourPillarsCourseSlug,
} from '@/app/(authed)/c/four-pillars/course-outline';

type LessonTarget = {
  section: { slug: string };
  lesson: CourseLesson;
};

function LessonNavButton({
  courseSlug,
  target,
  direction,
}: {
  courseSlug: FourPillarsCourseSlug;
  target: LessonTarget | undefined;
  direction: 'previous' | 'next';
}) {
  const Icon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon;
  const label = direction === 'previous' ? 'Previous lesson' : 'Next lesson';

  if (!target) {
    return (
      <Button
        type="button"
        size="icon-sm"
        variant="outline"
        disabled
        aria-label={label}
      >
        <Icon aria-hidden />
      </Button>
    );
  }

  return (
    <Link
      href={lessonHref(courseSlug, target.section.slug, target.lesson.slug)}
      aria-label={`${label}: ${target.lesson.title}`}
      className={cn(buttonVariants({ size: 'icon-sm', variant: 'outline' }))}
    >
      <Icon aria-hidden />
    </Link>
  );
}

export function LessonHeader({
  courseSlug,
  title,
  position,
  total,
  previous,
  next,
  resultsHref,
}: {
  courseSlug: FourPillarsCourseSlug;
  title: string;
  position: number;
  total: number;
  previous: LessonTarget | undefined;
  next: LessonTarget | undefined;
  resultsHref: LessonResultsHref;
}) {
  return (
    <header className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-sm text-muted-foreground tabular-nums">
          Lesson&nbsp;{position} of {total}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={resultsHref}
            className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
          >
            <ChartNoAxesColumnIncreasingIcon
              data-icon="inline-start"
              aria-hidden
            />
            Results
            <span
              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
              aria-hidden="true"
            />
          </Link>
          <nav
            aria-label="Lesson navigation"
            className="flex shrink-0 items-center gap-2"
          >
            <LessonNavButton
              courseSlug={courseSlug}
              target={previous}
              direction="previous"
            />
            <LessonNavButton
              courseSlug={courseSlug}
              target={next}
              direction="next"
            />
          </nav>
        </div>
      </div>

      <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
        {title}
      </h2>
    </header>
  );
}
