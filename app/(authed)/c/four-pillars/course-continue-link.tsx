'use client';

import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { useCourse } from '@/app/_components/course-provider';
import { buttonVariants } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';

import { lessonHref } from './course-href';
import { firstUnfinishedLesson, FOUR_PILLARS_COURSE_SLUG } from './curriculum';

export function CourseContinueLink() {
  const { completedLessonIds } = useCourse();
  const next = firstUnfinishedLesson(completedLessonIds);

  if (!next) {
    return null;
  }

  return (
    <Link
      href={lessonHref(
        FOUR_PILLARS_COURSE_SLUG,
        next.section.slug,
        next.lesson.slug
      )}
      aria-label={`Continue with lesson: ${next.lesson.title}`}
      className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
    >
      Continue
      <ArrowRightIcon data-icon="inline-end" aria-hidden />
    </Link>
  );
}
