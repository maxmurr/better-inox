import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeftIcon } from 'lucide-react';

import { QuizView } from '@/app/_components/quiz-view';
import { buttonVariants } from '@/app/_components/ui/button';
import { cn } from '@/app/_components/utils';
import { CourseHeaderActions } from '@/app/(authed)/c/four-pillars/course-header-actions';
import { courseHref } from '@/app/(authed)/c/four-pillars/course-href';
import { LessonFooter } from '@/app/(authed)/c/four-pillars/lesson-footer';
import { LessonHeader } from '@/app/(authed)/c/four-pillars/lesson-header';

import {
  findLesson,
  FOUR_PILLARS_COURSE_SLUG,
  lessonNavigation,
} from '../../curriculum';
import { findLessonContent } from '../../lesson-content';
import { findQuiz } from '../../quiz-content';

export async function generateMetadata({
  params,
}: PageProps<'/c/four-pillars/[section]/[lesson]'>): Promise<Metadata> {
  const { section, lesson } = await params;

  return { title: findLesson(section, lesson)?.title };
}

export default async function Page({
  params,
}: PageProps<'/c/four-pillars/[section]/[lesson]'>) {
  const { section, lesson } = await params;
  const navigation = lessonNavigation(section, lesson);

  if (!navigation) {
    notFound();
  }

  const currentLesson = navigation.lesson;

  const loadContent = findLessonContent(section, lesson);
  const Content = loadContent ? (await loadContent()).default : undefined;
  const quiz = findQuiz(section, lesson);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href={courseHref(FOUR_PILLARS_COURSE_SLUG)}
            aria-label="Back to course"
            className={cn(buttonVariants({ size: 'icon', variant: 'ghost' }))}
          >
            <ArrowLeftIcon aria-hidden />
          </Link>
          <h1 className="min-w-0 font-heading text-base leading-snug font-semibold tracking-tight text-balance text-foreground sm:text-lg">
            The 4 Pillars of Automated Tests
          </h1>
        </div>
        <CourseHeaderActions />
      </header>

      <main
        id="main-content"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 sm:gap-10 sm:px-8 sm:py-10">
          <article className="flex flex-col gap-6">
            <LessonHeader
              courseSlug={FOUR_PILLARS_COURSE_SLUG}
              title={currentLesson.title}
              position={navigation.position}
              total={navigation.total}
              previous={navigation.previous}
              next={navigation.next}
            />

            {Content ? (
              <div className="flex flex-col gap-4">
                <Content />
              </div>
            ) : null}

            {quiz ? (
              <QuizView
                lesson={{
                  id: currentLesson.id,
                  title: currentLesson.title,
                  quiz,
                }}
              />
            ) : null}

            {!Content && !quiz ? (
              <p className="text-sm text-pretty text-muted-foreground">
                This lesson has no written content yet.
              </p>
            ) : null}
          </article>
        </div>
      </main>

      <LessonFooter completed={currentLesson.completed} />
    </>
  );
}
