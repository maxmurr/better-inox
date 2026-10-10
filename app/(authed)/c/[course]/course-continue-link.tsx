'use client';

import Link from 'next/link';

import { ArrowRightIcon } from 'lucide-react';

import { useCourse } from '@/app/_components/course-provider';
import { buttonVariants } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';

import { lessonHref } from './course-href';
import { firstUnfinishedLesson, type CourseSection } from './curriculum';

export function CourseContinueLink({
  courseSlug,
  sections,
}: {
  courseSlug: string;
  sections: readonly CourseSection[];
}) {
  const { completedLessonIds } = useCourse();
  const next = firstUnfinishedLesson(sections, completedLessonIds);

  if (!next) {
    return null;
  }

  return (
    <Link
      href={lessonHref(courseSlug, next.section.slug, next.lesson.slug)}
      aria-label={`Continue with lesson: ${next.lesson.title}`}
      className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
    >
      Continue
      <ArrowRightIcon data-icon="inline-end" aria-hidden />
    </Link>
  );
}
