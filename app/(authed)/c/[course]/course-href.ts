/** Route to one lesson's learner results. */
export type LessonResultsHref = `/c/${string}/${string}/${string}/results`;

export function courseHref(courseSlug: string): `/c/${string}` {
  return `/c/${courseSlug}`;
}

export function sectionHref<SectionSlug extends string>(
  courseSlug: string,
  sectionSlug: SectionSlug
): `/c/${string}/${SectionSlug}` {
  return `/c/${courseSlug}/${sectionSlug}`;
}

export function lessonHref<
  SectionSlug extends string,
  LessonSlug extends string,
>(
  courseSlug: string,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug
): `/c/${string}/${SectionSlug}/${LessonSlug}` {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}`;
}

/** Builds route to one lesson's multi-learner learning results. */
export function lessonResultsHref<
  SectionSlug extends string,
  LessonSlug extends string,
>(
  courseSlug: string,
  sectionSlug: SectionSlug,
  lessonSlug: LessonSlug
): `/c/${string}/${SectionSlug}/${LessonSlug}/results` {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}/results`;
}
