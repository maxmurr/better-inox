'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import type { LearnerCourseProgress } from '@/src/entities/models/course-progress';
import {
  isAnswered,
  type QuestionOutcome,
  type QuizAttemptResult,
  type QuizLesson,
} from '@/src/entities/models/quiz';

const NO_SELECTIONS: readonly string[] = [];

type CourseContextValue = {
  completedLessonIds: ReadonlySet<string>;
  isLessonCompleted: (lessonId: string) => boolean;
  applyLessonCompletion: (lessonId: string, completed: boolean) => void;
  getAnswer: (lessonId: string, questionId: string) => string | undefined;
  setAnswer: (lessonId: string, questionId: string, optionId: string) => void;
  getSelections: (lessonId: string, questionId: string) => readonly string[];
  toggleSelection: (
    lessonId: string,
    questionId: string,
    optionId: string
  ) => void;
  isQuizSubmitted: (lessonId: string) => boolean;
  hasSavedQuizResult: (lessonId: string) => boolean;
  isPopQuestionSubmitted: (questionId: string) => boolean;
  markPopQuestionSubmitted: (questionId: string) => void;
  isQuizComplete: (lesson: QuizLesson) => boolean;
  outcomeFor: (
    lessonId: string,
    questionId: string
  ) => QuestionOutcome | undefined;
  quizResult: (lessonId: string) => QuizAttemptResult | undefined;
  applyQuizResult: (lessonId: string, result: QuizAttemptResult) => void;
  retakeQuiz: (lessonId: string) => void;
};

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

function selectionKey(lessonId: string, questionId: string) {
  return `${lessonId}:${questionId}`;
}

export function useCourse() {
  const context = useContext(CourseContext);

  if (!context) {
    throw new Error('useCourse must be used inside CourseProvider');
  }

  return context;
}

export function CourseProvider({
  initialProgress,
  children,
}: {
  initialProgress: LearnerCourseProgress;
  children: ReactNode;
}) {
  const [completedLessonIds, setCompletedLessonIds] = useState<
    ReadonlySet<string>
  >(() => new Set(initialProgress.completedLessonIds));
  const [selections, setSelections] = useState<
    Record<string, readonly string[]>
  >({});
  const [savedQuizLessonIds, setSavedQuizLessonIds] = useState<
    ReadonlySet<string>
  >(() => new Set(initialProgress.quizResults.map(({ lessonId }) => lessonId)));
  const [submittedPopQuestionIds, setSubmittedPopQuestionIds] = useState<
    ReadonlySet<string>
  >(new Set());
  const [results, setResults] = useState<Record<string, QuizAttemptResult>>(
    () =>
      Object.fromEntries(
        initialProgress.quizResults.map(({ lessonId, result }) => [
          lessonId,
          result,
        ])
      )
  );

  function isLessonCompleted(lessonId: string) {
    return completedLessonIds.has(lessonId);
  }

  function applyLessonCompletion(lessonId: string, completed: boolean) {
    setCompletedLessonIds((current) => {
      const next = new Set(current);
      if (completed) {
        next.add(lessonId);
      } else {
        next.delete(lessonId);
      }
      return next;
    });
  }

  function getSelections(lessonId: string, questionId: string) {
    return selections[selectionKey(lessonId, questionId)] ?? NO_SELECTIONS;
  }

  function getAnswer(lessonId: string, questionId: string) {
    return getSelections(lessonId, questionId)[0];
  }

  function setAnswer(lessonId: string, questionId: string, optionId: string) {
    setSelections((current) => ({
      ...current,
      [selectionKey(lessonId, questionId)]: [optionId],
    }));
  }

  function toggleSelection(
    lessonId: string,
    questionId: string,
    optionId: string
  ) {
    setSelections((current) => {
      const key = selectionKey(lessonId, questionId);
      const picked = current[key] ?? NO_SELECTIONS;

      return {
        ...current,
        [key]: picked.includes(optionId)
          ? picked.filter((id) => id !== optionId)
          : [...picked, optionId],
      };
    });
  }

  function quizResult(lessonId: string) {
    return results[lessonId];
  }

  function isQuizSubmitted(lessonId: string) {
    return results[lessonId] !== undefined;
  }

  function hasSavedQuizResult(lessonId: string) {
    return savedQuizLessonIds.has(lessonId);
  }

  function isPopQuestionSubmitted(questionId: string) {
    return submittedPopQuestionIds.has(questionId);
  }

  function markPopQuestionSubmitted(questionId: string) {
    setSubmittedPopQuestionIds((current) => new Set(current).add(questionId));
  }

  function isQuizComplete(lesson: QuizLesson) {
    return lesson.quiz.questions.every((question) =>
      isAnswered(question, getSelections(lesson.id, question.id))
    );
  }

  function outcomeFor(lessonId: string, questionId: string) {
    return results[lessonId]?.outcomes.find(
      (outcome) => outcome.questionId === questionId
    );
  }

  function applyQuizResult(lessonId: string, result: QuizAttemptResult) {
    setSavedQuizLessonIds((current) => new Set(current).add(lessonId));
    setResults((current) => ({ ...current, [lessonId]: result }));
  }

  function retakeQuiz(lessonId: string) {
    setResults((current) => {
      const next = { ...current };
      delete next[lessonId];
      return next;
    });
    setSelections((current) =>
      Object.fromEntries(
        Object.entries(current).filter(
          ([key]) => !key.startsWith(`${lessonId}:`)
        )
      )
    );
  }

  return (
    <CourseContext.Provider
      value={{
        completedLessonIds,
        isLessonCompleted,
        applyLessonCompletion,
        getAnswer,
        setAnswer,
        getSelections,
        toggleSelection,
        isQuizSubmitted,
        hasSavedQuizResult,
        isPopQuestionSubmitted,
        markPopQuestionSubmitted,
        isQuizComplete,
        outcomeFor,
        quizResult,
        applyQuizResult,
        retakeQuiz,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
