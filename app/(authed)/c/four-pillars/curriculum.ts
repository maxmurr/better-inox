import type { CourseSection } from '@/app/(authed)/c/four-pillars/course-outline';

type SectionOutline = {
  slug: string;
  title: string;
  lessonTitles: readonly string[];
  completed: boolean;
};

function lessonSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Lesson ids number every lesson in course order, so `l-8` is always the eighth
// lesson of the course no matter which section it sits in.
function withLessonIds(
  outlines: readonly SectionOutline[]
): readonly CourseSection[] {
  let position = 0;

  return outlines.map((outline) => ({
    slug: outline.slug,
    title: outline.title,
    lessons: outline.lessonTitles.map((title) => {
      position += 1;

      return {
        id: `l-${position}`,
        slug: lessonSlug(title),
        title,
        completed: outline.completed,
      };
    }),
  }));
}

export const FOUR_PILLARS_COURSE_SLUG = 'four-pillars';

const FOUR_PILLARS_OUTLINE: readonly SectionOutline[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    lessonTitles: [
      "What you'll learn",
      'How to get the most out of this course',
      'Checkpoint',
    ],
    completed: true,
  },
  {
    slug: 'maintainability',
    title: 'The First Pillar - Maintainability',
    lessonTitles: [
      'Good and Bad Automated Tests',
      'Readability',
      'Which test is easier to maintain?',
      'Maintainability',
      'Quiz - Maintainability',
      'Maintainability in the Test Pyramid',
      'How each type of test scores in Maintainability',
    ],
    completed: true,
  },
  {
    slug: 'feedback-speed',
    title: 'The Second Pillar - Feedback Speed',
    lessonTitles: [
      'The importance of feedback',
      'The importance of speed',
      'Quiz - Feedback and Speed',
      'Tests as Feedback',
      'How each type of test scores in Fast Feedback',
      'Quiz - Fast Feedback',
    ],
    completed: false,
  },
  {
    slug: 'protection-against-regression',
    title: 'The Third Pillar - Protection Against Regression',
    lessonTitles: [
      'Regressions',
      'Quiz - Protection Against Regressions',
      'The 3 attributes that matter',
      'Quiz - The 3 attributes that matter',
      'Protection in Unit Tests',
      'Protection in Integration Tests',
      'Protection in E2E Tests',
      'Quiz - Integration and E2E Protection',
      'How each type of test scores in Protection',
    ],
    completed: false,
  },
  {
    slug: 'resistance-to-refactoring',
    title: 'The fourth Pillar - Resistance to Refactoring',
    lessonTitles: [
      'But first, what is Refactoring',
      'Quiz - Define Refactoring',
      'Examples of Refactoring',
      'Resistance to Refactoring',
      'Quiz - Resistance to Refactoring',
      'Resistance to Refactoring in Unit Tests',
      'Resistance to Refactoring in Unit Tests - Part 2',
      'Resistance to Refactoring in Integration Tests',
      'Quiz - Resistance to Refactoring in Integration Tests',
      'Resistance to Refactoring in E2E Tests',
      'How each type of test scores in Resistancce to Refactoring',
      'Quiz - Resistance to Refactoring (Final)',
      'Give your Feedback!',
    ],
    completed: false,
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

export function firstUnfinishedLesson() {
  for (const section of FOUR_PILLARS_SECTIONS) {
    const lesson = section.lessons.find((candidate) => !candidate.completed);
    if (lesson) {
      return { section, lesson };
    }
  }
}
