import type { Quiz } from '@/src/entities/models/quiz';

const PASS_THRESHOLD = 0.5;

const QUIZ_CONTENT = {
  'maintainability/quiz-maintainability': {
    intro:
      "Review how out-of-process dependencies affect a test's maintainability.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'multiple',
        prompt: 'Which options are examples of out-of-process dependencies?',
        options: [
          { id: 'a', text: 'Local storage' },
          { id: 'b', text: 'Event loop' },
          { id: 'c', text: 'A database' },
          { id: 'd', text: 'A utility package such as Lodash' },
          { id: 'e', text: 'An external API' },
        ],
        correctOptionIds: ['a', 'c', 'e'],
      },
      {
        id: 'q2',
        kind: 'multiple',
        prompt: "Which options increase a test's maintainability?",
        options: [
          { id: 'a', text: 'Using for loops' },
          { id: 'b', text: 'Setting up intercepted API responses' },
          {
            id: 'c',
            text: 'Separating Arrange, Act, and Assert blocks',
          },
          { id: 'd', text: 'Using descriptive variable names' },
          { id: 'e', text: 'Using Scenario, Action, Outcome descriptions' },
        ],
        correctOptionIds: ['c', 'd', 'e'],
      },
    ],
  },
  'feedback-speed/quiz-feedback-and-speed': {
    intro: "Review what you've learned about feedback and speed.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'What is the purpose of feedback during software development?',
        options: [
          {
            id: 'a',
            text: "To collect users' opinions about the software's visual design.",
          },
          {
            id: 'b',
            text: 'To find ways to improve code performance before deployment.',
          },
          {
            id: 'c',
            text: 'To determine whether recent changes moved the system closer to solving the intended problem.',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt: 'Why does feedback speed matter during software development?',
        options: [
          {
            id: 'a',
            text: 'It lets developers finish features faster, regardless of quality.',
          },
          {
            id: 'b',
            text: 'Fast cycles remove the need to analyze requirements or adjust designs.',
          },
          {
            id: 'c',
            text: 'Fast feedback makes sure the product looks appealing before release.',
          },
          {
            id: 'd',
            text: 'Fast feedback catches errors and misunderstandings before they create more rework.',
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'feedback-speed/quiz-fast-feedback': {
    intro: "Review what you've learned about tests and feedback speed.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'What main benefit does an automated test provide?',
        options: [
          {
            id: 'a',
            text: 'It automatically covers every possible edge case.',
          },
          {
            id: 'b',
            text: "It reduces future refactoring by locking the system's design.",
          },
          {
            id: 'c',
            text: 'It tells you whether the system behaves as intended.',
          },
          {
            id: 'd',
            text: 'It guarantees that every future feature will be easier to build, regardless of complexity.',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Why use integration and end-to-end tests when unit tests score highest in maintainability and feedback speed?',
        options: [
          {
            id: 'a',
            text: 'High-level tests become faster than unit tests as a system grows.',
          },
          {
            id: 'b',
            text: 'Unit tests alone do not verify that all parts work together.',
          },
          {
            id: 'c',
            text: "Integration and E2E tests automatically document the system's architecture.",
          },
          {
            id: 'd',
            text: 'Unit tests become obsolete once a project has integration tests.',
          },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'protection-against-regression/quiz-protection-against-regressions': {
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Why does protection against regressions matter more as a software system grows?',
        options: [
          {
            id: 'a',
            text: 'Larger systems have fewer bugs, so they need tests only when someone introduces a regression intentionally.',
          },
          {
            id: 'b',
            text: 'Growing codebases gain hidden coupling and unpredictable interactions, so small changes can break existing behavior.',
          },
          {
            id: 'c',
            text: 'Regression tests remove the need to refactor, so teams can focus only on new features.',
          },
          {
            id: 'd',
            text: 'Regressions occur only in legacy systems because modern applications resist them.',
          },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'What does protection against regressions measure for an automated test?',
        options: [
          {
            id: 'a',
            text: 'How quickly the test runs compared with other test types.',
          },
          {
            id: 'b',
            text: 'How well the test catches previously working behavior that breaks after a code change.',
          },
          {
            id: 'c',
            text: 'How easy the test suite is to maintain over time.',
          },
          {
            id: 'd',
            text: 'How many features developers can add before updating the test.',
          },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'protection-against-regression/quiz-the-3-attributes-that-matter': {
    intro: "Review what you've learned about protection against regressions.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Which factors determine how strongly a test protects against regressions?',
        options: [
          {
            id: 'a',
            text: 'Test readability, code style consistency, and the number of mocks used',
          },
          {
            id: 'b',
            text: 'The programming language, the test framework, and the CI provider',
          },
          {
            id: 'c',
            text: 'Test coverage, code complexity, and the business importance of the tested behavior',
          },
          {
            id: 'd',
            text: "Test execution time, the test author's experience, and the size of the codebase",
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Why do tests of complex or business-critical code offer stronger protection against regressions?',
        options: [
          {
            id: 'a',
            text: 'They run faster, so they detect problems more often.',
          },
          {
            id: 'b',
            text: 'They use fewer dependencies, so they fail less often.',
          },
          {
            id: 'c',
            text: 'Trivial code is unstable and changes more often.',
          },
          {
            id: 'd',
            text: 'Complex, business-critical code is more prone to bugs and changes, and failures there have greater impact.',
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'protection-against-regression/quiz-integration-and-e2e-protection': {
    intro: 'Review how integration and E2E tests protect against regressions.',
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Why do integration tests provide more protection against regressions than unit tests?',
        options: [
          {
            id: 'a',
            text: 'They run faster and cover less logic.',
          },
          {
            id: 'b',
            text: 'They cover multiple components and out-of-process dependencies',
          },
          {
            id: 'c',
            text: 'They cover the entire system, so they replace E2E tests.',
          },
          {
            id: 'd',
            text: 'They mock every dependency to provide complete isolation.',
          },
          { id: 'e', text: 'They cover every logical branch in a use case.' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt: 'Why do E2E tests offer the strongest protection against bugs?',
        options: [
          {
            id: 'a',
            text: 'They run only pure in-memory functions with no external effects.',
          },
          { id: 'b', text: 'They handle UI interactions.' },
          {
            id: 'c',
            text: 'They run the full application as the user experiences it, including real APIs, databases, and external systems.',
          },
          {
            id: 'd',
            text: 'They need less setup and are easier to maintain than integration tests.',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        kind: 'single',
        prompt: 'Which scenario is best suited to an E2E test?',
        options: [
          {
            id: 'a',
            text: 'Check whether the createQuizModel function trims whitespace.',
          },
          {
            id: 'b',
            text: 'Check quiz creation with fake adapters and stubbed network responses.',
          },
          {
            id: 'c',
            text: 'Check whether isolated UI components render correctly in Storybook.',
          },
          {
            id: 'd',
            text: 'Verify that an authenticated user can create a quiz through the full application.',
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'resistance-to-refactoring/quiz-define-refactoring': {
    intro: "Review what you've learned about refactoring.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'Which description best defines refactoring?',
        options: [
          {
            id: 'a',
            text: 'Improving performance even when the outputs change slightly',
          },
          {
            id: 'b',
            text: 'Rewriting the entire codebase to meet new architectural requirements',
          },
          {
            id: 'c',
            text: 'Changing internal structure without changing external, observable behavior',
          },
          {
            id: 'd',
            text: "Changing the system's behavior to add features faster",
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt: 'Which scenario is an example of refactoring?',
        options: [
          {
            id: 'a',
            text: 'Change the logic so the same input returns a different output.',
          },
          {
            id: 'b',
            text: 'Replace a loop with clearer functional code while preserving the same input and output.',
          },
          {
            id: 'c',
            text: 'Add an endpoint that introduces new externally visible behavior.',
          },
          {
            id: 'd',
            text: 'Update UI text after marketing requests new wording.',
          },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'resistance-to-refactoring/quiz-resistance-to-refactoring': {
    intro: "Review what you've learned about resistance to refactoring.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'What does resistance to refactoring mean for automated tests?',
        options: [
          {
            id: 'a',
            text: 'How well a test detects internal implementation changes',
          },
          {
            id: 'b',
            text: 'How fast tests run after code cleanup',
          },
          {
            id: 'c',
            text: 'How many refactorings occur before a test fails',
          },
          {
            id: 'd',
            text: 'How well a test suite stays green after refactoring that preserves behavior',
          },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt: 'Which type of test is more likely to produce false positives?',
        options: [
          {
            id: 'a',
            text: "A test that asserts inputs and outputs from the user's perspective",
          },
          {
            id: 'b',
            text: 'A test that checks observable behavior through public APIs or UI interactions',
          },
          {
            id: 'c',
            text: 'A test that checks specific internal steps, components, or intermediate states',
          },
          {
            id: 'd',
            text: 'A test that fails only when business rules change',
          },
        ],
        correctOptionIds: ['c'],
      },
    ],
  },
  'resistance-to-refactoring/quiz-resistance-to-refactoring-in-integration-tests':
    {
      intro:
        'Review how integration tests resist changes to implementation details.',
      passThreshold: PASS_THRESHOLD,
      questions: [
        {
          id: 'q1',
          kind: 'single',
          prompt:
            'Why are integration tests more resistant to refactoring than unit tests?',
          options: [
            {
              id: 'a',
              text: 'Because they rely less on external dependencies',
            },
            { id: 'b', text: 'Because they are easier to maintain' },
            { id: 'c', text: 'Because they test the code in isolation' },
            {
              id: 'd',
              text: "Because they test from the user's perspective instead of checking implementation details",
            },
          ],
          correctOptionIds: ['d'],
        },
      ],
    },
  'resistance-to-refactoring/quiz-resistance-to-refactoring-final': {
    intro: "Review what you've learned about the four pillars.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Which test type is more resistant to refactoring: white-box or black-box?',
        options: [
          { id: 'a', text: 'White-box' },
          { id: 'b', text: 'Black-box' },
          { id: 'c', text: 'Both score the same' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Which test type should you prioritize for an app with complex business rules, a simple UI, and limited CI time?',
        options: [
          { id: 'a', text: 'Unit tests' },
          { id: 'b', text: 'Integration tests' },
          { id: 'c', text: 'E2E tests' },
          { id: 'd', text: 'Smoke tests' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        kind: 'multiple',
        prompt:
          'Which tests should you prioritize first in a legacy app with no tests, and why?',
        options: [
          { id: 'a', text: 'Unit tests, because they are easier to create' },
          {
            id: 'b',
            text: 'Integration tests, because they run faster',
          },
          {
            id: 'c',
            text: 'Unit tests, because they provide the strongest protection against regressions',
          },
          {
            id: 'd',
            text: 'E2E tests, because they provide the strongest resistance to refactoring',
          },
          {
            id: 'e',
            text: 'Integration tests, because they offer the best balance across all four pillars',
          },
        ],
        correctOptionIds: ['e'],
      },
      {
        id: 'q4',
        kind: 'single',
        prompt: 'Which two attributes should every automated test maximize?',
        options: [
          { id: 'a', text: 'Feedback speed and maintainability' },
          {
            id: 'b',
            text: 'Maintainability and protection against regressions',
          },
          {
            id: 'c',
            text: 'Resistance to refactoring and protection against regressions',
          },
          { id: 'd', text: 'Maintainability and resistance to refactoring' },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
} satisfies Record<string, Quiz>;

const QUIZ_CONTENT_BY_PATH = new Map(Object.entries(QUIZ_CONTENT));

export function findQuiz(sectionSlug: string, lessonSlug: string) {
  return QUIZ_CONTENT_BY_PATH.get(`${sectionSlug}/${lessonSlug}`);
}
