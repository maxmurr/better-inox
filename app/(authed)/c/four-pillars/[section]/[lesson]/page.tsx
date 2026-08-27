import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { QuizView } from '@/app/_components/quiz-view';
import { CourseHeaderActions } from '@/app/(authed)/c/four-pillars/course-header-actions';
import {
  courseHref,
  lessonHref,
  lessonResultsHref,
} from '@/app/(authed)/c/four-pillars/course-href';
import {
  FourPillarsCourseHeader,
  FourPillarsCourseMain,
} from '@/app/(authed)/c/four-pillars/course-page-shell';
import { LessonFooter } from '@/app/(authed)/c/four-pillars/lesson-footer';
import { LessonHeader } from '@/app/(authed)/c/four-pillars/lesson-header';

import {
  findLesson,
  FOUR_PILLARS_COURSE_SLUG,
  lessonNavigation,
} from '../../curriculum';
import {
  findLessonContent,
  findLessonPopQuestionIds,
} from '../../lesson-content';
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
  const requiredPopQuestionIds = findLessonPopQuestionIds(section, lesson);
  const nextLessonHref = navigation.next
    ? lessonHref(
        FOUR_PILLARS_COURSE_SLUG,
        navigation.next.section.slug,
        navigation.next.lesson.slug
      )
    : undefined;

  return (
    <>
      <FourPillarsCourseHeader
        actions={<CourseHeaderActions />}
        back={{
          href: courseHref(FOUR_PILLARS_COURSE_SLUG),
          label: 'Back to course',
        }}
      />

      <FourPillarsCourseMain>
        <article className="flex flex-col gap-6">
          <LessonHeader
            courseSlug={FOUR_PILLARS_COURSE_SLUG}
            title={currentLesson.title}
            position={navigation.position}
            total={navigation.total}
            previous={navigation.previous}
            next={navigation.next}
            resultsHref={lessonResultsHref(
              FOUR_PILLARS_COURSE_SLUG,
              section,
              lesson
            )}
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
      </FourPillarsCourseMain>

      <LessonFooter
        lessonId={currentLesson.id}
        nextLessonHref={nextLessonHref}
        isQuizLesson={Boolean(quiz)}
        requiredPopQuestionIds={requiredPopQuestionIds}
      />
    </>
  );
}
