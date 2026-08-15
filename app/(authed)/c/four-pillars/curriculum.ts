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

type LessonOutline = {
  slug: string;
  title: string;
};

type SectionOutline = {
  slug: string;
  title: string;
  lessons: readonly LessonOutline[];
};

// These path-based IDs are persisted. Slugs may be displayed in URLs, but must
// not be renamed or reused without an accompanying progress-data migration.
function withLessonIds(
  outlines: readonly SectionOutline[]
): readonly CourseSection[] {
  return outlines.map((section) => ({
    slug: section.slug,
    title: section.title,
    lessons: section.lessons.map((lesson) => ({
      id: `${section.slug}/${lesson.slug}`,
      slug: lesson.slug,
      title: lesson.title,
    })),
  }));
}

export const FOUR_PILLARS_COURSE_SLUG = 'four-pillars';

/** URL slug owned by four-pillars course routes. */
export type FourPillarsCourseSlug = typeof FOUR_PILLARS_COURSE_SLUG;

const FOUR_PILLARS_OUTLINE: readonly SectionOutline[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    lessons: [
      { slug: 'what-you-ll-learn', title: "What you'll learn" },
      {
        slug: 'how-to-get-the-most-out-of-this-course',
        title: 'How to get the most out of this course',
      },
      { slug: 'checkpoint', title: 'Checkpoint' },
    ],
  },
  {
    slug: 'maintainability',
    title: 'The First Pillar - Maintainability',
    lessons: [
      {
        slug: 'good-and-bad-automated-tests',
        title: 'Good and Bad Automated Tests',
      },
      { slug: 'readability', title: 'Readability' },
      {
        slug: 'which-test-is-easier-to-maintain',
        title: 'Which test is easier to maintain?',
      },
      { slug: 'maintainability', title: 'Maintainability' },
      { slug: 'quiz-maintainability', title: 'Quiz - Maintainability' },
      {
        slug: 'maintainability-in-the-test-pyramid',
        title: 'Maintainability in the Test Pyramid',
      },
      {
        slug: 'how-each-type-of-test-scores-in-maintainability',
        title: 'How each type of test scores in Maintainability',
      },
    ],
  },
  {
    slug: 'feedback-speed',
    title: 'The Second Pillar - Feedback Speed',
    lessons: [
      {
        slug: 'the-importance-of-feedback',
        title: 'The importance of feedback',
      },
      {
        slug: 'the-importance-of-speed',
        title: 'The importance of speed',
      },
      {
        slug: 'quiz-feedback-and-speed',
        title: 'Quiz - Feedback and Speed',
      },
      { slug: 'tests-as-feedback', title: 'Tests as Feedback' },
      {
        slug: 'how-each-type-of-test-scores-in-fast-feedback',
        title: 'How each type of test scores in Fast Feedback',
      },
      { slug: 'quiz-fast-feedback', title: 'Quiz - Fast Feedback' },
    ],
  },
  {
    slug: 'protection-against-regression',
    title: 'The Third Pillar - Protection Against Regression',
    lessons: [
      { slug: 'regressions', title: 'Regressions' },
      {
        slug: 'quiz-protection-against-regressions',
        title: 'Quiz - Protection Against Regressions',
      },
      {
        slug: 'the-3-attributes-that-matter',
        title: 'The 3 attributes that matter',
      },
      {
        slug: 'quiz-the-3-attributes-that-matter',
        title: 'Quiz - The 3 attributes that matter',
      },
      {
        slug: 'protection-in-unit-tests',
        title: 'Protection in Unit Tests',
      },
      {
        slug: 'protection-in-integration-tests',
        title: 'Protection in Integration Tests',
      },
      {
        slug: 'protection-in-e2e-tests',
        title: 'Protection in E2E Tests',
      },
      {
        slug: 'quiz-integration-and-e2e-protection',
        title: 'Quiz - Integration and E2E Protection',
      },
      {
        slug: 'how-each-type-of-test-scores-in-protection',
        title: 'How each type of test scores in Protection',
      },
    ],
  },
  {
    slug: 'resistance-to-refactoring',
    title: 'The fourth Pillar - Resistance to Refactoring',
    lessons: [
      {
        slug: 'but-first-what-is-refactoring',
        title: 'But first, what is Refactoring',
      },
      {
        slug: 'quiz-define-refactoring',
        title: 'Quiz - Define Refactoring',
      },
      {
        slug: 'examples-of-refactoring',
        title: 'Examples of Refactoring',
      },
      {
        slug: 'resistance-to-refactoring',
        title: 'Resistance to Refactoring',
      },
      {
        slug: 'quiz-resistance-to-refactoring',
        title: 'Quiz - Resistance to Refactoring',
      },
      {
        slug: 'resistance-to-refactoring-in-unit-tests',
        title: 'Resistance to Refactoring in Unit Tests',
      },
      {
        slug: 'resistance-to-refactoring-in-unit-tests-part-2',
        title: 'Resistance to Refactoring in Unit Tests - Part 2',
      },
      {
        slug: 'resistance-to-refactoring-in-integration-tests',
        title: 'Resistance to Refactoring in Integration Tests',
      },
      {
        slug: 'quiz-resistance-to-refactoring-in-integration-tests',
        title: 'Quiz - Resistance to Refactoring in Integration Tests',
      },
      {
        slug: 'resistance-to-refactoring-in-e2e-tests',
        title: 'Resistance to Refactoring in E2E Tests',
      },
      {
        slug: 'how-each-type-of-test-scores-in-resistancce-to-refactoring',
        title: 'How each type of test scores in Resistancce to Refactoring',
      },
      {
        slug: 'quiz-resistance-to-refactoring-final',
        title: 'Quiz - Resistance to Refactoring (Final)',
      },
      { slug: 'give-your-feedback', title: 'Give your Feedback!' },
    ],
  },
];

export const FOUR_PILLARS_SECTIONS = withLessonIds(FOUR_PILLARS_OUTLINE);

export function findSection(sectionSlug: string) {
  return FOUR_PILLARS_SECTIONS.find((section) => section.slug === sectionSlug);
}

export function findLesson(sectionSlug: string, lessonSlug: string) {
  return findSection(sectionSlug)?.lessons.find(
    (lesson) => lesson.slug === lessonSlug
  );
}

function courseLessons() {
  return FOUR_PILLARS_SECTIONS.flatMap((section) =>
    section.lessons.map((lesson) => ({ section, lesson }))
  );
}

export function findLessonById(lessonId: string) {
  return courseLessons().find((entry) => entry.lesson.id === lessonId);
}

export function lessonNavigation(sectionSlug: string, lessonSlug: string) {
  const entries = courseLessons();
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

export function firstUnfinishedLesson(completedLessonIds: ReadonlySet<string>) {
  for (const section of FOUR_PILLARS_SECTIONS) {
    const lesson = section.lessons.find(
      (candidate) => !completedLessonIds.has(candidate.id)
    );
    if (lesson) {
      return { section, lesson };
    }
  }
}
