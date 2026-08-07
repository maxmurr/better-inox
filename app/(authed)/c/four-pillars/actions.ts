'use server';

import { cookies } from 'next/headers';

import {
  AuthenticationError,
  UnauthenticatedError,
} from '@/src/entities/errors/auth';
import { InputParseError, NotFoundError } from '@/src/entities/errors/common';
import type { QuizSelections } from '@/src/entities/models/quiz';

import { SESSION_COOKIE } from '@/config';

import {
  setLessonCompletionAdapter,
  submitQuizAdapter,
} from '@/app/_lib/adapters/course-progress.adapters';
import {
  instrumentServerActionAdapter,
  reportAppErrorAdapter,
} from '@/app/_lib/adapters/monitoring.adapters';

import { findLessonById, FOUR_PILLARS_COURSE_SLUG } from './curriculum';
import { findQuiz } from './quiz-content';

export async function saveLessonCompletion(
  lessonId: string,
  completed: boolean
) {
  return await instrumentServerActionAdapter(
    'saveLessonCompletion',
    { recordResponse: true },
    async () => {
      try {
        const lesson = findLessonById(lessonId);
        if (!lesson) {
          throw new NotFoundError('Unknown lesson');
        }

        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        const saved = await setLessonCompletionAdapter(
          {
            courseSlug: FOUR_PILLARS_COURSE_SLUG,
            lessonId: lesson.lesson.id,
            completed,
          },
          sessionId
        );

        return { success: true as const, data: saved };
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          return { error: 'Your session expired. Sign in and try again.' };
        }
        if (err instanceof NotFoundError || err instanceof InputParseError) {
          return { error: 'Could not update this lesson.' };
        }

        await reportAppErrorAdapter(err);
        return {
          error:
            'Could not save lesson progress. The developers have been notified. Please try again later.',
        };
      }
    }
  );
}

export async function saveQuizSubmission(
  lessonId: string,
  selections: QuizSelections
) {
  return await instrumentServerActionAdapter(
    'saveQuizSubmission',
    { recordResponse: false },
    async () => {
      try {
        const lesson = findLessonById(lessonId);
        if (!lesson) {
          throw new NotFoundError('Unknown lesson');
        }

        const quiz = findQuiz(lesson.section.slug, lesson.lesson.slug);
        if (!quiz) {
          throw new NotFoundError('Lesson does not contain a quiz');
        }

        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        const saved = await submitQuizAdapter(
          {
            courseSlug: FOUR_PILLARS_COURSE_SLUG,
            lessonId: lesson.lesson.id,
            selections,
          },
          sessionId,
          quiz
        );

        return { success: true as const, data: saved };
      } catch (err) {
        if (
          err instanceof UnauthenticatedError ||
          err instanceof AuthenticationError
        ) {
          return { error: 'Your session expired. Sign in and try again.' };
        }
        if (err instanceof NotFoundError || err instanceof InputParseError) {
          return { error: 'Could not submit these quiz answers.' };
        }

        await reportAppErrorAdapter(err);
        return {
          error:
            'Could not save the quiz result. The developers have been notified. Please try again later.',
        };
      }
    }
  );
}
