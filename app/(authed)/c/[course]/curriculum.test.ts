import { describe, expect, it } from 'vitest';

import {
  loadCourse,
  loadLesson,
} from '@/app/(authed)/c/[course]/course-content';
import {
  findLessonById,
  firstUnfinishedLesson,
} from '@/app/(authed)/c/[course]/curriculum';

const course = await loadCourse('four-pillars');
if (!course) {
  throw new Error('content/four-pillars/course.json is missing');
}
const { sections } = course;
const lessons = sections.flatMap((section) =>
  section.lessons.map((lesson) => ({ section, lesson }))
);

describe('Four Pillars curriculum persistence IDs', () => {
  it('uses unique path-based IDs rather than course positions', () => {
    const ids = lessons.map(({ lesson }) => lesson.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.includes('/') && !/^l-\d+$/.test(id))).toBe(
      true
    );
    expect(
      findLessonById(sections, 'maintainability/good-and-bad-automated-tests')
    ).toMatchObject({
      section: { slug: 'maintainability' },
      lesson: {
        id: 'maintainability/good-and-bad-automated-tests',
        slug: 'good-and-bad-automated-tests',
      },
    });
  });

  it('finds the first incomplete lesson from the learner completion set', () => {
    const completed = new Set(
      lessons.slice(0, 2).map(({ lesson }) => lesson.id)
    );

    expect(firstUnfinishedLesson(sections, completed)?.lesson.id).toBe(
      'maintainability/which-test-is-easier-to-maintain'
    );
  });

  it('has no continue target when every lesson is complete', () => {
    const completed = new Set(lessons.map(({ lesson }) => lesson.id));

    expect(firstUnfinishedLesson(sections, completed)).toBeUndefined();
  });

  it('keeps all ten canonical quizzes', async () => {
    const loaded = await Promise.all(
      lessons.map(({ section, lesson }) =>
        loadLesson(course.slug, section.slug, lesson.slug)
      )
    );

    expect(loaded.filter(({ quiz }) => quiz)).toHaveLength(10);
  });
});

describe('loadCourse', () => {
  it.each(['missing-course', '..', '../content', 'Four-Pillars', ''])(
    'finds no course for %j',
    async (slug) => {
      expect(await loadCourse(slug)).toBeUndefined();
    }
  );
});
