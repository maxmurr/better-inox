import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { resolvePopQuestionResponse } from '@/app/_components/pop-question';
import {
  CONTENT_DIR,
  parsePopQuestions,
} from '@/app/(authed)/c/[course]/course-content';

describe('resolvePopQuestionResponse', () => {
  it('returns the shared explanation when the question has no per-option feedback', () => {
    const response = resolvePopQuestionResponse({
      explanation: 'Test case 2 states the scenario clearly.',
      selected: 'a',
    });

    expect(response).toBe('Test case 2 states the scenario clearly.');
  });

  it('returns the feedback for the selected option', () => {
    const response = resolvePopQuestionResponse({
      feedback: { a: 'Cryptic names.', b: 'Clear scenario.' },
      selected: 'b',
    });

    expect(response).toBe('Clear scenario.');
  });

  it('falls back to the shared explanation when the selected option has no feedback', () => {
    const response = resolvePopQuestionResponse({
      explanation: 'Either way, naming matters.',
      feedback: { a: 'Cryptic names.' },
      selected: 'b',
    });

    expect(response).toBe('Either way, naming matters.');
  });

  it('returns undefined when the question carries no response at all', () => {
    const response = resolvePopQuestionResponse({ selected: 'a' });

    expect(response).toBeUndefined();
  });
});

function mdxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      return mdxFiles(path);
    }

    return entry.name.endsWith('.mdx') ? [path] : [];
  });
}

describe('lesson PopQuestion content', () => {
  const questions = mdxFiles(CONTENT_DIR).flatMap((file) =>
    parsePopQuestions(readFileSync(file, 'utf8')).map((question) => ({
      ...question,
      file,
    }))
  );

  it.each(questions)(
    'reads a literal id from every question in $file',
    ({ id }) => {
      expect(id).toBeDefined();
    }
  );

  it('finds globally unique questions to check', () => {
    expect(questions.length).toBeGreaterThan(0);
    expect(new Set(questions.map(({ id }) => id)).size).toBe(questions.length);
  });

  it.each(questions)(
    'resolves a response for every option of $id in $file',
    ({ optionIds, feedbackKeys, hasExplanation }) => {
      expect(optionIds.length).toBeGreaterThan(0);

      for (const optionId of optionIds) {
        expect(
          resolvePopQuestionResponse({
            explanation: hasExplanation ? 'shared' : undefined,
            feedback: Object.fromEntries(
              feedbackKeys.map((key) => [key, 'per option'])
            ),
            selected: optionId,
          })
        ).toBeDefined();
      }
    }
  );

  it.each(questions)(
    'keys every feedback entry of $id in $file to a real option',
    ({ optionIds, feedbackKeys }) => {
      for (const key of feedbackKeys) {
        expect(optionIds).toContain(key);
      }
    }
  );
});
