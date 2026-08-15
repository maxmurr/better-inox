import type { FourPillarsCourseSlug } from './curriculum';

/** Route to one four-pillars lesson's learner results. */
export type LessonResultsHref =
  `/c/${FourPillarsCourseSlug}/${string}/${string}/results`;

export function courseHref(
  courseSlug: FourPillarsCourseSlug
): `/c/${FourPillarsCourseSlug}` {
  return `/c/${courseSlug}`;
}

export function sectionHref<SectionSlug extends string>(
  courseSlug: FourPillarsCourseSlug,
  sectionSlug: SectionSlug
): `/c/${FourPillarsCourseSlug}/${SectionSlug}` {
  return `/c/${courseSlug}/${sectionSlug}`;
}

export function lessonHref<
  SectionSlug extends string,
  LessonSlug extends string,
>(
  courseSlug: FourPillarsCourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug
): `/c/${FourPillarsCourseSlug}/${SectionSlug}/${LessonSlug}` {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}`;
}

/** Builds route to one lesson's multi-learner learning results. */
export function lessonResultsHref<
  SectionSlug extends string,
  LessonSlug extends string,
>(
  courseSlug: FourPillarsCourseSlug,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug
): `/c/${FourPillarsCourseSlug}/${SectionSlug}/${LessonSlug}/results` {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}/results`;
}
