import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  CONTENT_DIR,
  loadCourse,
  loadLesson,
} from '@/app/(authed)/c/[course]/course-content';

// Run by `pnpm course:check`. Every folder in content/ is a course.
const courseSlugs = readdirSync(CONTENT_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const LESSON_FILE = /\.(mdx|quiz\.json)$/;

function lessonFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return lessonFiles(path);
    }
    return LESSON_FILE.test(entry.name) ? [path] : [];
  });
}

describe.each(courseSlugs)('course %s', (courseSlug) => {
  it('has a valid course.json', async () => {
    await expect(loadCourse(courseSlug)).resolves.toBeDefined();
  });

  it('gives every lesson valid MDX or quiz content', async () => {
    const course = await loadCourse(courseSlug);
    const lessons = course?.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({ section, lesson }))
    );

    for (const { section, lesson } of lessons ?? []) {
      const loaded = await loadLesson(courseSlug, section.slug, lesson.slug);
      expect(
        loaded.hasContent || loaded.quiz !== undefined,
        `${lesson.id} needs ${lesson.id}.mdx or ${lesson.id}.quiz.json`
      ).toBe(true);
    }
  });

  it('has no lesson files missing from course.json', async () => {
    const course = await loadCourse(courseSlug);
    const lessonIds = new Set(
      course?.sections.flatMap((section) =>
        section.lessons.map((lesson) => lesson.id)
      )
    );
    const courseDir = join(CONTENT_DIR, courseSlug);
    const orphans = lessonFiles(courseDir)
      .map((file) => relative(courseDir, file))
      .filter((file) => !lessonIds.has(file.replace(LESSON_FILE, '')));

    expect(orphans).toEqual([]);
  });
});
