'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

import {
  gradeQuiz,
  isAnswered,
  type QuestionOutcome,
  type QuizAttemptResult,
  type QuizLesson,
} from '@/app/_components/quiz';

const NO_SELECTIONS: readonly string[] = [];

type CourseContextValue = {
  getAnswer: (lessonId: string, questionId: string) => string | undefined;
  setAnswer: (lessonId: string, questionId: string, optionId: string) => void;
  getSelections: (lessonId: string, questionId: string) => readonly string[];
  toggleSelection: (
    lessonId: string,
    questionId: string,
    optionId: string
  ) => void;
  isQuizSubmitted: (lessonId: string) => boolean;
  isQuizComplete: (lesson: QuizLesson) => boolean;
  outcomeFor: (
    lessonId: string,
    questionId: string
  ) => QuestionOutcome | undefined;
  quizResult: (lessonId: string) => QuizAttemptResult | undefined;
  submitQuiz: (lesson: QuizLesson) => void;
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

export function CourseProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<
    Record<string, readonly string[]>
  >({});
  const [results, setResults] = useState<Record<string, QuizAttemptResult>>({});

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

  function submitQuiz(lesson: QuizLesson) {
    const result = gradeQuiz(lesson.quiz, (question) =>
      getSelections(lesson.id, question.id)
    );

    setResults((current) => ({ ...current, [lesson.id]: result }));
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
        getAnswer,
        setAnswer,
        getSelections,
        toggleSelection,
        isQuizSubmitted,
        isQuizComplete,
        outcomeFor,
        quizResult,
        submitQuiz,
        retakeQuiz,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}
