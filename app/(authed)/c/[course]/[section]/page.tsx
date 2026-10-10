import { notFound, redirect } from 'next/navigation';

import { loadCourse } from '../course-content';
import { lessonHref } from '../course-href';
import { findSection } from '../curriculum';

export default async function Page({
  params,
}: PageProps<'/c/[course]/[section]'>) {
  const { course: courseSlug, section } = await params;
  const course = await loadCourse(courseSlug);
  const found = course && findSection(course.sections, section);
  const firstLesson = found?.lessons[0];

  if (!course || !found || !firstLesson) {
    notFound();
  }

  redirect(lessonHref(course.slug, found.slug, firstLesson.slug));
}
