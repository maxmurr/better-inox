'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useCourse } from '@/app/_components/course-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion';
import { Button } from '@/app/_components/ui/button';

import { lessonHref } from './course-href';
import type { CourseSection, FourPillarsCourseSlug } from './curriculum';
import { LessonCompletionStatus } from './lesson-completion-status';

export type {
  CourseLesson,
  CourseSection,
  FourPillarsCourseSlug,
} from './curriculum';

function firstUnfinishedSection(
  sections: readonly CourseSection[],
  completedLessonIds: ReadonlySet<string>
) {
  return sections.find((section) =>
    section.lessons.some((lesson) => !completedLessonIds.has(lesson.id))
  );
}

export function CourseOutline({
  courseSlug,
  sections,
}: {
  courseSlug: FourPillarsCourseSlug;
  sections: readonly CourseSection[];
}) {
  const { completedLessonIds, isLessonCompleted } = useCourse();
  const [openSections, setOpenSections] = useState<string[]>(() => {
    const current = firstUnfinishedSection(sections, completedLessonIds);
    return current ? [current.slug] : [];
  });

  const allExpanded = openSections.length === sections.length;
  const lessonCount = sections.reduce(
    (total, section) => total + section.lessons.length,
    0
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border pb-3">
        <p className="min-w-0 text-sm text-pretty text-muted-foreground tabular-nums">
          {sections.length}&nbsp;sections • {lessonCount}&nbsp;lessons
        </p>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="min-w-26 shrink-0"
          onClick={() =>
            setOpenSections(
              allExpanded ? [] : sections.map((section) => section.slug)
            )
          }
        >
          {allExpanded ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>

      <Accordion
        multiple
        value={openSections}
        onValueChange={(value: string[]) => setOpenSections(value)}
        className="gap-2"
      >
        {sections.map((section) => (
          <AccordionItem
            key={section.slug}
            value={section.slug}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <AccordionTrigger
              indicator="start"
              className="min-h-12 gap-3 rounded-none px-4 hover:bg-muted/40 focus-visible:ring-inset"
            >
              <span className="min-w-0 flex-1 text-pretty">
                {section.title}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {section.lessons.length}&nbsp;lessons
              </span>
            </AccordionTrigger>
            <AccordionContent className="bg-background px-4 pt-1 pb-3 [&_a]:no-underline">
              <ul className="flex flex-col">
                {section.lessons.map((lesson) => {
                  const completed = isLessonCompleted(lesson.id);

                  return (
                    <li key={lesson.id}>
                      <Link
                        href={lessonHref(courseSlug, section.slug, lesson.slug)}
                        className="-mx-2 flex min-h-9 touch-manipulation items-center gap-3 rounded-lg border border-transparent px-2 py-1 transition-colors outline-none hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <LessonCompletionStatus completed={completed}>
                          <span className="min-w-0 flex-1 text-pretty text-foreground">
                            {lesson.title}
                          </span>
                        </LessonCompletionStatus>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
