import { notFound, redirect } from 'next/navigation';

import { lessonHref } from '../course-href';
import { findSection, FOUR_PILLARS_COURSE_SLUG } from '../curriculum';

export default async function Page({
  params,
}: PageProps<'/c/four-pillars/[section]'>) {
  const { section } = await params;
  const found = findSection(section);
  const firstLesson = found?.lessons[0];

  if (!found || !firstLesson) {
    notFound();
  }

  redirect(lessonHref(FOUR_PILLARS_COURSE_SLUG, found.slug, firstLesson.slug));
}
