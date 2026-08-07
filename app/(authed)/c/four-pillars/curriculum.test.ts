import { describe, expect, it } from 'vitest';

import { quizSchema } from '@/src/entities/models/quiz';

import {
  findLessonById,
  firstUnfinishedLesson,
  FOUR_PILLARS_SECTIONS,
} from '@/app/(authed)/c/four-pillars/curriculum';
import { findQuiz } from '@/app/(authed)/c/four-pillars/quiz-content';

const lessons = FOUR_PILLARS_SECTIONS.flatMap((section) =>
  section.lessons.map((lesson) => ({ section, lesson }))
);

describe('Four Pillars curriculum persistence IDs', () => {
  it('uses unique path-based IDs rather than course positions', () => {
    const ids = lessons.map(({ lesson }) => lesson.id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.includes('/') && !/^l-\d+$/.test(id))).toBe(
      true
    );
    expect(findLessonById('introduction/what-you-ll-learn')).toMatchObject({
      section: { slug: 'introduction' },
      lesson: {
        id: 'introduction/what-you-ll-learn',
        slug: 'what-you-ll-learn',
      },
    });
  });

  it('finds the first incomplete lesson from the learner completion set', () => {
    const completed = new Set(
      lessons.slice(0, 2).map(({ lesson }) => lesson.id)
    );

    expect(firstUnfinishedLesson(completed)?.lesson.id).toBe(
      'introduction/checkpoint'
    );
  });

  it('has no continue target when every lesson is complete', () => {
    const completed = new Set(lessons.map(({ lesson }) => lesson.id));

    expect(firstUnfinishedLesson(completed)).toBeUndefined();
  });

  it('keeps every canonical quiz valid against its question and option IDs', () => {
    const quizzes = lessons
      .map(({ section, lesson }) => findQuiz(section.slug, lesson.slug))
      .filter((quiz) => quiz !== undefined);

    expect(quizzes).toHaveLength(11);
    for (const quiz of quizzes) {
      expect(() => quizSchema.parse(quiz)).not.toThrow();
    }
  });
});
