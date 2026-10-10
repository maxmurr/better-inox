import { cookies } from 'next/headers';

import type { LearnerCourseProgress } from '@/src/entities/models/course-progress';

import type { LessonLearningResultsData } from '../adapters/course-progress.adapters';
import {
  DEV_DATASET_COOKIE,
  parseDevDataset,
  type DevDataset,
} from './datasets';

// Dev-only worst-case fixtures. Every value goes through the same Zod schema as
// real data at its boundary (adapter `stubSchema`, `courseOutlineSchema`,
// `quizSchema`), so a fixture the schemas reject fails loudly.

async function currentDataset() {
  return parseDevDataset((await cookies()).get(DEV_DATASET_COOKIE)?.value);
}

// Usernames come from `usernameFromEmail`: the lowercased local part of an
// @inox.co.th address stripped to [a-z0-9_-], cut at 25 chars, with a numeric or
// 6-char user-ID suffix on collision (max 31 per `userSchema`).
const LONGEST_USERNAME = 'kittiphongjaroenwattanakua1b2c3';
const BROKEN_AVATAR = 'https://example.com/avatars/kittiphong-404.jpg';

const CURRENT_USERS = {
  demo: { id: 'u-demo', username: 'maxmurr', avatarUrl: null },
  worst: {
    id: 'u-worst',
    username: LONGEST_USERNAME,
    avatarUrl: BROKEN_AVATAR,
  },
  empty: { id: 'u-empty', username: 'usera', avatarUrl: null },
  one: { id: 'u-one', username: 'userjo', avatarUrl: null },
  huge: { id: 'u-demo', username: 'maxmurr', avatarUrl: null },
} satisfies Record<
  DevDataset,
  { id: string; username: string; avatarUrl: string | null }
>;

type Learner = LessonLearningResultsData['learners'][number];

function learner(
  username: string,
  completed: boolean,
  quiz?: [correct: number, total: number],
  avatarUrl: string | null = null
): Learner {
  return {
    learnerId: `l-${username}`,
    username,
    avatarUrl,
    completed,
    quizResult: quiz
      ? {
          correct: quiz[0],
          total: quiz[1],
          score: quiz[0] / quiz[1],
          passed: quiz[0] / quiz[1] >= 0.5,
        }
      : null,
  };
}

// Mirrors get-lesson-learning-results.controller.ts.
function learningResults(learners: Learner[]): LessonLearningResultsData {
  const submitted = learners.flatMap((l) =>
    l.quizResult ? [l.quizResult] : []
  );
  const completedCount = learners.filter((l) => l.completed).length;
  return {
    summary: {
      startedCount: learners.length,
      completedCount,
      completionRate:
        learners.length === 0 ? 0 : completedCount / learners.length,
      quizSubmissionCount: submitted.length,
      averageQuizScore:
        submitted.length === 0
          ? null
          : submitted.reduce((sum, r) => sum + r.score, 0) / submitted.length,
    },
    learners,
  };
}

const NAME_POOL = [
  'suphawadeesrisuwannakul',
  'thanakornwongsakulchai',
  'nok',
  'pimchanokratanapongpai',
  'userjo',
  'chaiyapornsrisuwannakul',
  'max',
  'usera',
];

const LEARNING_RESULTS = {
  demo: learningResults([
    learner('maxmurr', true, [4, 5]),
    learner('janedoe', true, [5, 5]),
    learner('somchai', false),
  ]),
  worst: learningResults([
    learner(LONGEST_USERNAME, true, [7, 7], BROKEN_AVATAR),
    learner('userjo', false),
    learner('usera', true, [0, 7]),
    learner('suphawadeesrisuwannakul', false, [2, 3]),
    learner('nok', true, [1, 3]),
    learner('kittiphongjaroenwattanaku2', true, [5, 7]),
    learner('pimchanokratanapongpai', false),
    learner('thanakornwongsakulchai', true, [6, 7]),
  ]),
  empty: learningResults([]),
  one: learningResults([learner('userjo', true, [1, 1])]),
  huge: learningResults(
    Array.from({ length: 1284 }, (_, index) =>
      learner(
        `${NAME_POOL[index % NAME_POOL.length]}${index + 2}`,
        index % 3 !== 0,
        index % 4 === 0 ? undefined : [index % 8, 7]
      )
    )
  ),
} satisfies Record<DevDataset, LessonLearningResultsData>;

const DEMO_PROGRESS: LearnerCourseProgress = {
  completedLessonIds: [
    'maintainability/good-and-bad-automated-tests',
    'maintainability/readability',
    'maintainability/which-test-is-easier-to-maintain',
  ],
  quizResults: [],
};

const COURSE_PROGRESS = {
  demo: DEMO_PROGRESS,
  worst: DEMO_PROGRESS,
  empty: { completedLessonIds: [], quizResults: [] },
  one: {
    completedLessonIds: ['maintainability/good-and-bad-automated-tests'],
    quizResults: [],
  },
  huge: DEMO_PROGRESS,
} satisfies Record<DevDataset, LearnerCourseProgress>;

const ADAPTER_FIXTURES = {
  getCurrentUser: CURRENT_USERS,
  getLessonLearningResults: LEARNING_RESULTS,
  getCourseProgress: COURSE_PROGRESS,
};

function hasFixture(name: string): name is keyof typeof ADAPTER_FIXTURES {
  return Object.hasOwn(ADAPTER_FIXTURES, name);
}

export async function devAdapterFixture(adapterName: string) {
  if (!hasFixture(adapterName)) {
    return;
  }
  const dataset = await currentDataset();
  return dataset ? ADAPTER_FIXTURES[adapterName][dataset] : undefined;
}

type Outline = {
  title: string;
  sections: {
    slug: string;
    title: string;
    lessons: { slug: string; title: string }[];
  }[];
};

// Real slugs stay so lesson MDX, quizzes, and progress IDs still resolve.
function worstCourse(outline: Outline): Outline {
  const [first, second, third, ...rest] = outline.sections;
  const [goodBad, readability, ...firstRest] = first.lessons;
  return {
    title:
      'The 4 Pillars of Automated Tests: Maintainability, Fast Feedback, Protection Against Regressions & Resistance to Refactoring',
    sections: [
      {
        ...first,
        lessons: [
          {
            ...goodBad,
            title:
              'Why shouldReturnDatabaseOperationErrorWhenGetUserByUsernameThrows Is Still a Bad Test Name',
          },
          {
            ...readability,
            title: 'ความอ่านง่ายของเทสต์และการตั้งชื่อเทสต์ให้สื่อความหมาย',
          },
          ...firstRest,
        ],
      },
      {
        ...second,
        title: 'Speed',
        lessons: second.lessons.map((lesson, index) =>
          index === 0 ? { ...lesson, title: 'Q&A' } : lesson
        ),
      },
      {
        ...third,
        title:
          'The Third Pillar — Protection Against Regressions in Unit, Integration & End-to-End Tests',
      },
      ...rest,
    ],
  };
}

function oneLessonCourse(outline: Outline): Outline {
  const [first] = outline.sections;
  return { ...outline, sections: [{ ...first, lessons: [first.lessons[0]] }] };
}

type QuizJson = {
  questions: { prompt: string; options: { text: string }[] }[];
};

function worstQuiz(quiz: QuizJson): QuizJson {
  const [q1, q2, ...rest] = quiz.questions;
  return {
    ...quiz,
    questions: [
      {
        ...q1,
        prompt:
          'Your UserService test spins up a Postgres container, seeds three tables, and calls getUserByUsername() through the HTTP layer. Which of these are out-of-process dependencies that make the test harder to maintain?',
        options: q1.options.map((option, index) =>
          index === 1
            ? {
                ...option,
                text: 'shouldReturnDatabaseOperationErrorWhenGetUserByUsernameThrows',
              }
            : index === 3
              ? {
                  ...option,
                  text: 'A utility package such as Lodash, which is installed from npm, imported at module scope, and executes entirely inside the same Node.js process as the test runner without touching the network or the file system',
                }
              : option
        ),
      },
      {
        ...q2,
        options: q2.options.map((option, index) =>
          index === 0
            ? {
                ...option,
                text: 'ใช้ฐานข้อมูลที่รันอยู่ในคอนเทนเนอร์ Docker แยกต่างหาก',
              }
            : option
        ),
      },
      ...rest,
    ],
  };
}

/** Rewrites a `content/` JSON file for the active dev dataset. */
export async function devContentSource(
  slugs: readonly string[],
  extension: string,
  source: string
) {
  const dataset = await currentDataset();
  const path = slugs.slice(1).join('/') + extension;

  if (dataset === 'worst' && path === 'course.json') {
    return JSON.stringify(worstCourse(JSON.parse(source)));
  }
  if (dataset === 'one' && path === 'course.json') {
    return JSON.stringify(oneLessonCourse(JSON.parse(source)));
  }
  if (
    dataset === 'worst' &&
    path === 'maintainability/quiz-maintainability.quiz.json'
  ) {
    return JSON.stringify(worstQuiz(JSON.parse(source)));
  }
  return source;
}
