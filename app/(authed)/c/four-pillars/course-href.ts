import type { Route } from 'next';

export function courseHref(courseSlug: string) {
  return `/c/${courseSlug}` as Route;
}

export function sectionHref(courseSlug: string, sectionSlug: string) {
  return `/c/${courseSlug}/${sectionSlug}` as Route;
}

export function lessonHref(
  courseSlug: string,
  sectionSlug: string,
  lessonSlug: string
) {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}` as Route;
}

/** Builds route to one lesson's multi-learner learning results. */
export function lessonResultsHref(
  courseSlug: string,
  sectionSlug: string,
  lessonSlug: string
) {
  return `/c/${courseSlug}/${sectionSlug}/${lessonSlug}/results` as Route;
}
