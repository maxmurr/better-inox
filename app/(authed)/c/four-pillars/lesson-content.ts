import type { MDXContent } from 'mdx/types';

type LessonContentLoader = () => Promise<{ default: MDXContent }>;

const LESSON_CONTENT: Record<string, LessonContentLoader> = {
  'introduction/what-you-ll-learn': () =>
    import('@/content/four-pillars/introduction/what-you-ll-learn.mdx'),
  'introduction/how-to-get-the-most-out-of-this-course': () =>
    import('@/content/four-pillars/introduction/how-to-get-the-most-out-of-this-course.mdx'),
  'maintainability/good-and-bad-automated-tests': () =>
    import('@/content/four-pillars/maintainability/good-and-bad-automated-tests.mdx'),
  'maintainability/readability': () =>
    import('@/content/four-pillars/maintainability/readability.mdx'),
  'maintainability/which-test-is-easier-to-maintain': () =>
    import('@/content/four-pillars/maintainability/which-test-is-easier-to-maintain.mdx'),
  'maintainability/maintainability': () =>
    import('@/content/four-pillars/maintainability/maintainability.mdx'),
  'maintainability/maintainability-in-the-test-pyramid': () =>
    import('@/content/four-pillars/maintainability/maintainability-in-the-test-pyramid.mdx'),
  'maintainability/how-each-type-of-test-scores-in-maintainability': () =>
    import('@/content/four-pillars/maintainability/how-each-type-of-test-scores-in-maintainability.mdx'),
  'feedback-speed/the-importance-of-feedback': () =>
    import('@/content/four-pillars/feedback-speed/the-importance-of-feedback.mdx'),
  'feedback-speed/the-importance-of-speed': () =>
    import('@/content/four-pillars/feedback-speed/the-importance-of-speed.mdx'),
  'feedback-speed/tests-as-feedback': () =>
    import('@/content/four-pillars/feedback-speed/tests-as-feedback.mdx'),
  'feedback-speed/how-each-type-of-test-scores-in-fast-feedback': () =>
    import('@/content/four-pillars/feedback-speed/how-each-type-of-test-scores-in-fast-feedback.mdx'),
  'protection-against-regression/regressions': () =>
    import('@/content/four-pillars/protection-against-regression/regressions.mdx'),
  'protection-against-regression/the-3-attributes-that-matter': () =>
    import('@/content/four-pillars/protection-against-regression/the-3-attributes-that-matter.mdx'),
  'protection-against-regression/protection-in-unit-tests': () =>
    import('@/content/four-pillars/protection-against-regression/protection-in-unit-tests.mdx'),
  'protection-against-regression/protection-in-integration-tests': () =>
    import('@/content/four-pillars/protection-against-regression/protection-in-integration-tests.mdx'),
  'protection-against-regression/protection-in-e2e-tests': () =>
    import('@/content/four-pillars/protection-against-regression/protection-in-e2e-tests.mdx'),
  'protection-against-regression/how-each-type-of-test-scores-in-protection':
    () =>
      import('@/content/four-pillars/protection-against-regression/how-each-type-of-test-scores-in-protection.mdx'),
  'resistance-to-refactoring/but-first-what-is-refactoring': () =>
    import('@/content/four-pillars/resistance-to-refactoring/but-first-what-is-refactoring.mdx'),
  'resistance-to-refactoring/examples-of-refactoring': () =>
    import('@/content/four-pillars/resistance-to-refactoring/examples-of-refactoring.mdx'),
  'resistance-to-refactoring/resistance-to-refactoring': () =>
    import('@/content/four-pillars/resistance-to-refactoring/resistance-to-refactoring.mdx'),
  'resistance-to-refactoring/resistance-to-refactoring-in-unit-tests': () =>
    import('@/content/four-pillars/resistance-to-refactoring/resistance-to-refactoring-in-unit-tests.mdx'),
  'resistance-to-refactoring/resistance-to-refactoring-in-unit-tests-part-2':
    () =>
      import('@/content/four-pillars/resistance-to-refactoring/resistance-to-refactoring-in-unit-tests-part-2.mdx'),
  'resistance-to-refactoring/resistance-to-refactoring-in-integration-tests':
    () =>
      import('@/content/four-pillars/resistance-to-refactoring/resistance-to-refactoring-in-integration-tests.mdx'),
  'resistance-to-refactoring/resistance-to-refactoring-in-e2e-tests': () =>
    import('@/content/four-pillars/resistance-to-refactoring/resistance-to-refactoring-in-e2e-tests.mdx'),
  'resistance-to-refactoring/how-each-type-of-test-scores-in-resistancce-to-refactoring':
    () =>
      import('@/content/four-pillars/resistance-to-refactoring/how-each-type-of-test-scores-in-resistancce-to-refactoring.mdx'),
  'resistance-to-refactoring/give-your-feedback': () =>
    import('@/content/four-pillars/resistance-to-refactoring/give-your-feedback.mdx'),
};

export function findLessonContent(sectionSlug: string, lessonSlug: string) {
  return LESSON_CONTENT[`${sectionSlug}/${lessonSlug}`];
}
