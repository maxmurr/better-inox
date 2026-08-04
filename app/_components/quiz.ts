export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  kind: 'single' | 'multiple';
  options: readonly QuizOption[];
  correctOptionIds: readonly string[];
};

export type Quiz = {
  intro?: string;
  passThreshold: number;
  questions: readonly QuizQuestion[];
};

export type QuizLesson = {
  id: string;
  title: string;
  quiz: Quiz;
};

export type QuestionOutcome = {
  questionId: string;
  selectedOptionIds: readonly string[];
  correctOptionIds: readonly string[];
  isCorrect: boolean;
};

export type QuizAttemptResult = {
  outcomes: readonly QuestionOutcome[];
  correct: number;
  total: number;
  score: number;
  passed: boolean;
};

function pickedOptionIds(answer: string | readonly string[] | undefined) {
  if (typeof answer === 'string') {
    return answer === '' ? [] : [answer];
  }

  return answer ?? [];
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

export function gradeQuestion(
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
