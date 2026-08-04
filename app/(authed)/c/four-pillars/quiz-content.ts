import type { Quiz } from '@/app/_components/quiz';

const PASS_THRESHOLD = 0.5;

// Keyed by `section/lesson`, like LESSON_CONTENT. The lesson id and title come
// from the curriculum, so they cannot drift from the outline.
const QUIZ_CONTENT: Record<string, Quiz> = {
  'introduction/checkpoint': {
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'multiple',
        prompt:
          "Check the boxes below to acknowledge what you've learned so far",
        options: [
          {
            id: 'a',
            text: 'I understand that this is a self-paced course with a focus on the attributes of good automated tests',
          },
          {
            id: 'b',
            text: 'I commit to at least 10 minutes of learning every day to keep motivated',
          },
          {
            id: 'c',
            text: 'I understood that Retrieval Practice is one of the best ways to acquire and retain knowledge',
          },
        ],
        correctOptionIds: ['a', 'b', 'c'],
      },
    ],
  },
  'maintainability/quiz-maintainability': {
    intro:
      "We've briefly discussed out-of-process dependencies and their contribution to maintainability - now it's time to answer a few questions to recap the concepts.",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'multiple',
        prompt:
          'Select the options below that represent examples of out-of-process dependencies.',
        options: [
          { id: 'a', text: 'Local Storage' },
          { id: 'b', text: 'Event Loop' },
          { id: 'c', text: 'Database' },
          { id: 'd', text: 'A utility package (like lodash)' },
          { id: 'e', text: 'An external API' },
        ],
        correctOptionIds: ['a', 'c', 'e'],
      },
      {
        id: 'q2',
        kind: 'multiple',
        prompt: "Select the options that *increase* a test's maintainability",
        options: [
          { id: 'a', text: "Usage of 'for' loops" },
          { id: 'b', text: 'Setting up API interceptions' },
          {
            id: 'c',
            text: 'Explicit separation of Arrange, Act and Assert blocks',
          },
          { id: 'd', text: 'Descriptive variable names' },
          { id: 'e', text: 'Scenario - Action - Outcome test descriptions' },
        ],
        correctOptionIds: ['c', 'd', 'e'],
      },
    ],
  },
  'feedback-speed/quiz-feedback-and-speed': {
    intro: "Let us recap what we've learned so far about feedback and speed:",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'What best explains the true purpose of feedback during the development process?',
        options: [
          {
            id: 'a',
            text: 'To collect user opinions about the visual design of the software.',
          },
          {
            id: 'b',
            text: 'To identify opportunities to optimize code performance before deployment.',
          },
          {
            id: 'c',
            text: 'To determine whether recent changes have successfully moved the system closer to solving the intended problem.',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Why is feedback speed critical during the software development cycle?',
        options: [
          {
            id: 'a',
            text: 'Because it allows developers to complete features faster regardless of quality.',
          },
          {
            id: 'b',
            text: 'Because rapid cycles eliminate the need for requirement analysis or design adjustments.',
          },
          {
            id: 'c',
            text: 'Because faster feedback ensures the product is visually appealing before release.',
          },
          {
            id: 'd',
            text: 'Because quick feedback prevents the accumulation of errors and misunderstandings, reducing rework and wasted effort.',
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'feedback-speed/quiz-fast-feedback': {
    intro:
      "Let's do a final round to review what we learned in the past two lessons:",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'Why does writing tests maximize the benefits?',
        options: [
          {
            id: 'a',
            text: 'They will cover every possible edge case automatically',
          },
          {
            id: 'b',
            text: "Tests reduce the need for refactoring later by locking the system's design",
          },
          {
            id: 'c',
            text: 'To receive feedback whether the system behaves as intended',
          },
          {
            id: 'd',
            text: 'Tests guarantee that next features will be easier to implement — regardless of their complexity',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Why still invest in integration and end-to-end tests, considering unit tests score highest in both Maintainability and Feedback Speed?',
        options: [
          {
            id: 'a',
            text: 'High-level tests run faster once a system grows, eventually outperforming unit tests',
          },
          {
            id: 'b',
            text: "Unit tests alone doesn't verify whether everything is wired well together and works.",
          },
          {
            id: 'c',
            text: "Because integration and E2E tests automatically generate documentation for the system's architecture",
          },
          {
            id: 'd',
            text: 'Because unit tests become obsolete once integration tests are introduced into the project',
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
          'Why does "Protection Against Regression" become increasingly important as a software system grows?',
        options: [
          {
            id: 'a',
            text: 'Because larger systems automatically reduce the number of bugs, making tests less necessary unless regressions are intentionally introduced.',
          },
          {
            id: 'b',
            text: 'Because growing codebases accumulate more hidden coupling and unpredictable interactions, making it easier for small changes to unintentionally break existing behavior.',
          },
          {
            id: 'c',
            text: 'Because refactoring becomes unnecessary as soon as regression testing is introduced, shifting the focus entirely to new feature development.',
          },
          {
            id: 'd',
            text: 'Because regressions only occur in legacy systems, and modern applications are naturally resistant to them.',
          },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'What does Protection Against Regression measure in the context of automated tests?',
        options: [
          {
            id: 'a',
            text: 'How quickly a test executes compared to other test types.',
          },
          {
            id: 'b',
            text: 'How well a test helps prevent previously working features from breaking when the codebase changes.',
          },
          {
            id: 'c',
            text: 'How easy it is to maintain the test suite over long periods of time.',
          },
          {
            id: 'd',
            text: 'How many new features can be implemented before the test needs to be updated.',
          },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'protection-against-regression/quiz-the-3-attributes-that-matter': {
    intro: "Let's recap what we've just learned",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Which determines how strongly a test protects against regressions?',
        options: [
          {
            id: 'a',
            text: 'Test readability, code style consistency, and number of mocks used',
          },
          {
            id: 'b',
            text: 'The programming language, the test framework, and the CI provider',
          },
          {
            id: 'c',
            text: 'Test coverage breadth, code complexity, and the business importance of the exercised functionality',
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
          'Why do tests that target highly complex or business-critical code offer stronger protection against regression?',
        options: [
          {
            id: 'a',
            text: 'Because they run faster and therefore detect issues more frequently',
          },
          {
            id: 'b',
            text: 'Because they require fewer dependencies and thus fail less often',
          },
          {
            id: 'c',
            text: 'Because trivial code is inherently unstable and changes more frequently',
          },
          {
            id: 'd',
            text: 'Because complex and domain-relevant code is more prone to bugs and changes, making failures in these areas more impactful',
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'protection-against-regression/quiz-integration-and-e2e-protection': {
    intro:
      "Based on what we discussed so far about integration and E2E tests' level of protection, answer the following questions:",
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
            text: 'They run faster, cover less logic by reducing the chance of missing issues',
          },
          {
            id: 'b',
            text: 'They cover multiple components and out-of-process dependencies',
          },
          {
            id: 'c',
            text: 'Integration tests replace the need for E2E tests by covering the entire system',
          },
          {
            id: 'd',
            text: 'Tests mock every dependency, ensuring complete isolation',
          },
          { id: 'e', text: 'They cover every logical branch of a use case' },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'What is the main reason E2E tests offer the highest protection against bugs?',
        options: [
          {
            id: 'a',
            text: 'They execute only pure in-memory functions with no external effects',
          },
          { id: 'b', text: 'They handle UI interactions' },
          {
            id: 'c',
            text: 'They run the full application exactly as the user experiences it, including real APIs, databases, and other external systems',
          },
          {
            id: 'd',
            text: 'They require fewer setup steps and are easier to maintain than integration tests',
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        kind: 'single',
        prompt: 'Select the best scenario for an E2E test:',
        options: [
          {
            id: 'a',
            text: 'Verifying whether the createQuizModel function trims whitespace',
          },
          {
            id: 'b',
            text: 'Ensuring the quiz is created via fakes adapters and stubbed network responses',
          },
          {
            id: 'c',
            text: 'Checking that UI components render correctly when isolated in Storybook',
          },
          {
            id: 'd',
            text: "Asserting the authentication, because creating quiz isn't possible otherwise",
          },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
  'resistance-to-refactoring/quiz-define-refactoring': {
    intro: "Let's recap what we've just learned about Refactoring:",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt: 'Select the best refactoring description/definition.',
        options: [
          {
            id: 'a',
            text: 'Optimizing performance even if the outputs change slightly',
          },
          {
            id: 'b',
            text: 'Rewriting the entire codebase to match new architectural requirements',
          },
          {
            id: 'c',
            text: 'Modifying internal structure without altering the external, observable behavior',
          },
          {
            id: 'd',
            text: "Changing the system's behavior to add new features more quickly",
          },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        kind: 'single',
        prompt:
          'Which scenario qualifies as refactoring based on the explanation?',
        options: [
          {
            id: 'a',
            text: 'Changing the logic so that the same input now returns a different output',
          },
          {
            id: 'b',
            text: 'Replacing a loop with a more readable functional composition while keeping input/output the same',
          },
          {
            id: 'c',
            text: 'Adding a new endpoint that introduces new externally visible behavior',
          },
          {
            id: 'd',
            text: 'Updating UI text because marketing requested new wording',
          },
        ],
        correctOptionIds: ['b'],
      },
    ],
  },
  'resistance-to-refactoring/quiz-resistance-to-refactoring': {
    intro: "Let's recap what we've just learned:",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'What does “Resistance to Refactoring” mean in the context of automated tests?',
        options: [
          {
            id: 'a',
            text: 'The ability of a test to detect internal implementation changes immediately',
          },
          {
            id: 'b',
            text: 'The speed at which tests execute after code cleanup',
          },
          {
            id: 'c',
            text: 'The number of refactorings a test requires before failing',
          },
          {
            id: 'd',
            text: 'The degree to which a test suite remains green after the system is refactored without behavior changes',
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
            text: 'test that verifies observable behavior through public APIs or UI interactions',
          },
          {
            id: 'c',
            text: 'A test that checks specific internal steps, components, or intermediate states of the system',
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
      intro: "Let's recap what we've learned:",
      passThreshold: PASS_THRESHOLD,
      questions: [
        {
          id: 'q1',
          kind: 'single',
          prompt:
            'Why integration tests are more resistant to refactoring than unit tests?',
          options: [
            {
              id: 'a',
              text: 'Because they rely less on external dependencies',
            },
            { id: 'b', text: 'Because they are easier to maintain' },
            { id: 'c', text: 'Because they test the code in isolation' },
            {
              id: 'd',
              text: 'Because they test the code from the user perspective and not the implementation details',
            },
          ],
          correctOptionIds: ['d'],
        },
      ],
    },
  'resistance-to-refactoring/quiz-resistance-to-refactoring-final': {
    intro: "Let's do a final recap of what we've learned so far:",
    passThreshold: PASS_THRESHOLD,
    questions: [
      {
        id: 'q1',
        kind: 'single',
        prompt:
          'Consider two types of automated tests: white-box and black-box. Which type scores better at resistance to refactoring?',
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
          'Given a scenario of an application that has complex business rules but a comparatively simple UI, and we have a constraint of CI time to execute the tests, which type of automated test should we focus on?',
        options: [
          { id: 'a', text: 'Unit Tests' },
          { id: 'b', text: 'Integration Tests' },
          { id: 'c', text: 'E2E Tests' },
          { id: 'd', text: 'Smoke Tests' },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        kind: 'multiple',
        prompt:
          'Given that you have a legacy application with no tests yet, which types of tests should you prioritize, and why?',
        options: [
          { id: 'a', text: 'Unit Tests, because they are simpler to create' },
          {
            id: 'b',
            text: 'Integration Tests, because they are faster to execute',
          },
          {
            id: 'c',
            text: 'Unit Tests, because they provide the highest protection against regressions',
          },
          {
            id: 'd',
            text: 'E2E Tests, because they provide the highest resistance to refactoring',
          },
          {
            id: 'e',
            text: 'Integration tests, because they strike the best balance between all pillars.',
          },
        ],
        correctOptionIds: ['e'],
      },
      {
        id: 'q4',
        kind: 'single',
        prompt:
          'Given the hard constraint for each type of automated test, what two attributes from the four pillars should we invest the most?',
        options: [
          { id: 'a', text: 'Feedback Speed and Maintainability' },
          {
            id: 'b',
            text: 'Maintainability and Protection against Regressions',
          },
          {
            id: 'c',
            text: 'Resistance to Refactoring and Protection against Regressions',
          },
          { id: 'd', text: 'Maintainability and Resistance to Refactoring' },
        ],
        correctOptionIds: ['d'],
      },
    ],
  },
};

export function findQuiz(sectionSlug: string, lessonSlug: string) {
  return QUIZ_CONTENT[`${sectionSlug}/${lessonSlug}`];
}
