import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import type { MDXContent } from 'mdx/types';

import { QuizView } from '@/app/_components/quiz-view';
import { CourseHeaderActions } from '@/app/(authed)/c/[course]/course-header-actions';
import {
  courseHref,
  lessonHref,
  lessonResultsHref,
} from '@/app/(authed)/c/[course]/course-href';
import {
  CoursePageHeader,
  CoursePageMain,
} from '@/app/(authed)/c/[course]/course-page-shell';
import { LessonFooter } from '@/app/(authed)/c/[course]/lesson-footer';
import { LessonHeader } from '@/app/(authed)/c/[course]/lesson-header';

import { loadCourse, loadLesson } from '../../course-content';
import { findLesson, lessonNavigation } from '../../curriculum';

export async function generateMetadata({
  params,
}: PageProps<'/c/[course]/[section]/[lesson]'>): Promise<Metadata> {
  const { course: courseSlug, section, lesson } = await params;
  const course = await loadCourse(courseSlug);

  return {
    title: course && findLesson(course.sections, section, lesson)?.title,
  };
}

export default async function Page({
  params,
}: PageProps<'/c/[course]/[section]/[lesson]'>) {
  const { course: courseSlug, section, lesson } = await params;
  const course = await loadCourse(courseSlug);
  const navigation =
    course && lessonNavigation(course.sections, section, lesson);

  if (!course || !navigation) {
    notFound();
  }

  const currentLesson = navigation.lesson;
  const { hasContent, popQuestionIds, quiz } = await loadLesson(
    course.slug,
    section,
    lesson
  );
  const Content: MDXContent | undefined = hasContent
    ? (await import(`@/content/${course.slug}/${section}/${lesson}.mdx`))
        .default
    : undefined;
  const nextLessonHref = navigation.next
    ? lessonHref(
        course.slug,
        navigation.next.section.slug,
        navigation.next.lesson.slug
      )
    : undefined;

  return (
    <>
      <CoursePageHeader
        courseTitle={course.title}
        actions={<CourseHeaderActions />}
        back={{
          href: courseHref(course.slug),
          label: 'Back to course',
        }}
      />

      <CoursePageMain>
        <article className="flex flex-col gap-6">
          <LessonHeader
            courseSlug={course.slug}
            title={currentLesson.title}
            position={navigation.position}
            total={navigation.total}
            previous={navigation.previous}
            next={navigation.next}
            resultsHref={lessonResultsHref(course.slug, section, lesson)}
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
      </CoursePageMain>

      <LessonFooter
        lessonId={currentLesson.id}
        nextLessonHref={nextLessonHref}
        isQuizLesson={Boolean(quiz)}
        requiredPopQuestionIds={popQuestionIds}
      />
    </>
  );
}
