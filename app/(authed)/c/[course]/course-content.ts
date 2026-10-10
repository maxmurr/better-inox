import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { cache } from 'react';

import {
  courseOutlineSchema,
  courseSlugSchema,
} from '@/src/entities/models/course';
import { quizSchema } from '@/src/entities/models/quiz';

import { withLessonIds } from './curriculum';

export const CONTENT_DIR = join(process.cwd(), 'content');

/**
 * Reads `content/<slugs...><extension>`. Every slug is validated first because
 * route params and server action arguments reach this function.
 */
async function readContentFile(slugs: readonly string[], extension: string) {
  if (!slugs.every((slug) => courseSlugSchema.safeParse(slug).success)) {
    return;
  }

  try {
    const source = await readFile(
      join(CONTENT_DIR, ...slugs) + extension,
      'utf8'
    );
    if (process.env.NODE_ENV === 'development') {
      const { devContentSource } = await import('@/app/_lib/dev-data/fixtures');
      return await devContentSource(slugs, extension, source);
    }
    return source;
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return;
    }
    throw err;
  }
}

export const loadCourse = cache(async (courseSlug: string) => {
  const source = await readContentFile([courseSlug, 'course'], '.json');
  if (source === undefined) {
    return;
  }

  const outline = courseOutlineSchema.parse(JSON.parse(source));
  return {
    slug: courseSlug,
    title: outline.title,
    sections: withLessonIds(outline.sections),
  };
});
export type Course = NonNullable<Awaited<ReturnType<typeof loadCourse>>>;

/**
 * Loads one lesson's files: `<lesson>.mdx` for written content and
 * `<lesson>.quiz.json` for a quiz. The MDX itself is compiled by the bundler,
 * so pages import it separately; here it is read only for pop question IDs.
 */
export const loadLesson = cache(
  async (courseSlug: string, sectionSlug: string, lessonSlug: string) => {
    const slugs = [courseSlug, sectionSlug, lessonSlug];
    const [mdx, quiz] = await Promise.all([
      readContentFile(slugs, '.mdx'),
      readContentFile(slugs, '.quiz.json'),
    ]);

    return {
      hasContent: mdx !== undefined,
      popQuestionIds: mdx
        ? parsePopQuestions(mdx).flatMap(({ id }) => (id ? [id] : []))
        : [],
      quiz: quiz === undefined ? undefined : quizSchema.parse(JSON.parse(quiz)),
    };
  }
);

function region(block: string, open: string, close: string) {
  const start = block.indexOf(open);

  if (start === -1) {
    return '';
  }

  const end = block.indexOf(close, start);

  return end === -1 ? '' : block.slice(start + open.length, end);
}

// ponytail: string scan, not an MDX parse. Expects the Prettier layout used in
// content/ (`/>` on its own line); `pnpm course:check` fails on anything else.
export function parsePopQuestions(source: string) {
  return source
    .split('<PopQuestion')
    .slice(1)
    .map((rest) => rest.slice(0, rest.indexOf('\n/>')))
    .map((block) => ({
      id: /\bid=\{?\s*['"]([^'"]+)['"]/.exec(block)?.[1],
      optionIds: [
        ...region(block, 'options={[', ']}').matchAll(/id:\s*'([^']*)'/g),
      ].map((match) => match[1]),
      feedbackKeys: [
        ...region(block, 'feedback={{', '}}').matchAll(/^\s*([\w]+):/gm),
      ].map((match) => match[1]),
      hasExplanation: block.includes('explanation='),
    }));
}
