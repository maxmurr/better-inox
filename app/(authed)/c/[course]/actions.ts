'use server';

import { cookies } from 'next/headers';

import { UnauthenticatedError } from '@/src/entities/errors/auth';
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

import { loadCourse, loadLesson } from './course-content';
import { findLessonById } from './curriculum';

async function findCourseLesson(courseSlug: string, lessonId: string) {
  const course = await loadCourse(courseSlug);
  const lesson = course && findLessonById(course.sections, lessonId);
  if (!course || !lesson) {
    throw new NotFoundError('Unknown lesson');
  }

  return { course, ...lesson };
}

export async function saveLessonCompletion(
  courseSlug: string,
  lessonId: string,
  completed: boolean
) {
  return await instrumentServerActionAdapter(
    'saveLessonCompletion',
    { recordResponse: true },
    async () => {
      try {
        const lesson = await findCourseLesson(courseSlug, lessonId);

        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        const saved = await setLessonCompletionAdapter(
          {
            courseSlug: lesson.course.slug,
            lessonId: lesson.lesson.id,
            completed,
          },
          sessionId
        );

        return { success: true as const, data: saved };
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
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
  courseSlug: string,
  lessonId: string,
  selections: QuizSelections
) {
  return await instrumentServerActionAdapter(
    'saveQuizSubmission',
    { recordResponse: false },
    async () => {
      try {
        const lesson = await findCourseLesson(courseSlug, lessonId);

        const { quiz } = await loadLesson(
          lesson.course.slug,
          lesson.section.slug,
          lesson.lesson.slug
        );
        if (!quiz) {
          throw new NotFoundError('Lesson does not contain a quiz');
        }

        const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
        const saved = await submitQuizAdapter(
          {
            courseSlug: lesson.course.slug,
            lessonId: lesson.lesson.id,
            selections,
          },
          sessionId,
          quiz
        );

        return { success: true as const, data: saved };
      } catch (err) {
        if (err instanceof UnauthenticatedError) {
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
