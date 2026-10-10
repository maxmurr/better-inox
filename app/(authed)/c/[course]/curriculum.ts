import type { CourseOutline } from '@/src/entities/models/course';

export type CourseLesson = {
  id: string;
  slug: string;
  title: string;
};

export type CourseSection = {
  slug: string;
  title: string;
  lessons: readonly CourseLesson[];
};

// These path-based IDs are persisted. Slugs may be displayed in URLs, but must
// not be renamed or reused without an accompanying progress-data migration.
export function withLessonIds(
  sections: CourseOutline['sections']
): readonly CourseSection[] {
  return sections.map((section) => ({
    slug: section.slug,
    title: section.title,
    lessons: section.lessons.map((lesson) => ({
      id: `${section.slug}/${lesson.slug}`,
      slug: lesson.slug,
      title: lesson.title,
    })),
  }));
}

export function findSection(
  sections: readonly CourseSection[],
  sectionSlug: string
) {
  return sections.find((section) => section.slug === sectionSlug);
}

export function findLesson(
  sections: readonly CourseSection[],
  sectionSlug: string,
  lessonSlug: string
) {
  return findSection(sections, sectionSlug)?.lessons.find(
    (lesson) => lesson.slug === lessonSlug
  );
}

function courseLessons(sections: readonly CourseSection[]) {
  return sections.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson }))
  );
}

export function findLessonById(
  sections: readonly CourseSection[],
  lessonId: string
) {
  return courseLessons(sections).find((entry) => entry.lesson.id === lessonId);
}

export function lessonNavigation(
  sections: readonly CourseSection[],
  sectionSlug: string,
  lessonSlug: string
) {
  const entries = courseLessons(sections);
  const index = entries.findIndex(
    (entry) =>
      entry.section.slug === sectionSlug && entry.lesson.slug === lessonSlug
  );

  if (index === -1) {
    return;
  }

  return {
    lesson: entries[index].lesson,
    position: index + 1,
    total: entries.length,
    previous: entries[index - 1],
    next: entries[index + 1],
  };
}

export function firstUnfinishedLesson(
  sections: readonly CourseSection[],
  completedLessonIds: ReadonlySet<string>
) {
  for (const section of sections) {
    const lesson = section.lessons.find(
      (candidate) => !completedLessonIds.has(candidate.id)
    );
    if (lesson) {
      return { section, lesson };
    }
  }
}
