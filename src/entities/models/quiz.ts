import { z } from 'zod';

import { InputParseError } from '@/src/entities/errors/common';

const contentIdSchema = z.string().trim().min(1);

export const quizOptionSchema = z.object({
  id: contentIdSchema,
  text: z.string().min(1),
});
export type QuizOption = z.infer<typeof quizOptionSchema>;

export const quizQuestionSchema = z
  .object({
    id: contentIdSchema,
    prompt: z.string().min(1),
    kind: z.enum(['single', 'multiple']),
    options: z.array(quizOptionSchema).min(1),
    correctOptionIds: z.array(contentIdSchema).min(1),
  })
  .superRefine((question, context) => {
    const optionIds = question.options.map((option) => option.id);
    if (new Set(optionIds).size !== optionIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Quiz option IDs must be unique',
        path: ['options'],
      });
    }

    if (
      question.correctOptionIds.some(
        (optionId) => !optionIds.includes(optionId)
      )
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Correct options must belong to the question',
        path: ['correctOptionIds'],
      });
    }

    if (
      new Set(question.correctOptionIds).size !==
      question.correctOptionIds.length
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Correct option IDs must be unique',
        path: ['correctOptionIds'],
      });
    }

    if (question.kind === 'single' && question.correctOptionIds.length !== 1) {
      context.addIssue({
        code: 'custom',
        message: 'Single-choice questions must have one correct option',
        path: ['correctOptionIds'],
      });
    }
  });
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;

export const quizSchema = z
  .object({
    intro: z.string().min(1).optional(),
    passThreshold: z.number().min(0).max(1),
    questions: z.array(quizQuestionSchema).min(1),
  })
  .superRefine((quiz, context) => {
    const questionIds = quiz.questions.map((question) => question.id);
    if (new Set(questionIds).size !== questionIds.length) {
      context.addIssue({
        code: 'custom',
        message: 'Quiz question IDs must be unique',
        path: ['questions'],
      });
    }
  });
export type Quiz = z.infer<typeof quizSchema>;

export const quizLessonSchema = z.object({
  id: contentIdSchema,
  title: z.string().min(1),
  quiz: quizSchema,
});
export type QuizLesson = z.infer<typeof quizLessonSchema>;

export const questionOutcomeSchema = z.object({
  questionId: contentIdSchema,
  selectedOptionIds: z.array(contentIdSchema),
  correctOptionIds: z.array(contentIdSchema).min(1),
  isCorrect: z.boolean(),
});
export type QuestionOutcome = z.infer<typeof questionOutcomeSchema>;

export const quizAttemptResultSchema = z
  .object({
    outcomes: z.array(questionOutcomeSchema).min(1),
    correct: z.number().int().nonnegative(),
    total: z.number().int().positive(),
    score: z.number().min(0).max(1),
    passed: z.boolean(),
  })
  .refine(({ correct, total }) => correct <= total, {
    message: 'Correct answers cannot exceed total questions',
    path: ['correct'],
  });
export type QuizAttemptResult = z.infer<typeof quizAttemptResultSchema>;

export const quizSelectionsSchema = z.record(
  contentIdSchema,
  z.array(contentIdSchema)
);
export type QuizSelections = z.infer<typeof quizSelectionsSchema>;

const pickedOptionIdsSchema = z
  .union([
    z.string().transform((answer) => (answer === '' ? [] : [answer])),
    z.array(z.string()),
  ])
  .optional()
  .transform((answer) => answer ?? []);

function pickedOptionIds(
  answer: string | readonly string[] | undefined
): string[] {
  return pickedOptionIdsSchema.parse(answer);
}

export function isAnswered(
  question: QuizQuestion,
  answer: string | readonly string[] | undefined
) {
  return pickedOptionIds(answer).length > 0;
}

function sameOptions(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

function gradeQuestion(
  question: QuizQuestion,
  answer: string | readonly string[] | undefined
): QuestionOutcome {
  const selectedOptionIds = pickedOptionIds(answer);

  return {
    questionId: question.id,
    selectedOptionIds,
    correctOptionIds: question.correctOptionIds,
    isCorrect: sameOptions(selectedOptionIds, question.correctOptionIds),
  };
}

export function gradeQuiz(
  quiz: Quiz,
  answerFor: (question: QuizQuestion) => string | readonly string[] | undefined
): QuizAttemptResult {
  const outcomes = quiz.questions.map((question) =>
    gradeQuestion(question, answerFor(question))
  );
  const correct = outcomes.filter((outcome) => outcome.isCorrect).length;
  const total = outcomes.length;
  const score = total === 0 ? 0 : correct / total;

  return {
    outcomes,
    correct,
    total,
    score,
    passed: score >= quiz.passThreshold,
  };
}

export function parseQuizSelections(
  quiz: Quiz,
  selections: QuizSelections
): QuizSelections {
  const questionIds = new Set(quiz.questions.map((question) => question.id));
  const submittedQuestionIds = Object.keys(selections);

  if (
    submittedQuestionIds.length !== questionIds.size ||
    submittedQuestionIds.some((questionId) => !questionIds.has(questionId))
  ) {
    throw new InputParseError('Answer every quiz question exactly once');
  }

  for (const question of quiz.questions) {
    const selectedOptionIds = selections[question.id];
    const optionIds = new Set(question.options.map((option) => option.id));

    if (
      !selectedOptionIds ||
      selectedOptionIds.length === 0 ||
      (question.kind === 'single' && selectedOptionIds.length !== 1) ||
      new Set(selectedOptionIds).size !== selectedOptionIds.length ||
      selectedOptionIds.some((optionId) => !optionIds.has(optionId))
    ) {
      throw new InputParseError(
        `Invalid selections for question "${question.id}"`
      );
    }
  }

  return Object.fromEntries(
    quiz.questions.map((question) => [
      question.id,
      [...selections[question.id]],
    ])
  );
}

export function gradeQuizSelections(quiz: Quiz, selections: QuizSelections) {
  const validatedSelections = parseQuizSelections(quiz, selections);
  return gradeQuiz(quiz, (question) => validatedSelections[question.id]);
}
