# Lesson style

Conventions from `content/four-pillars/`. The `writing-quality` rules apply on
top of these.

## Lessons

- One idea per lesson, usually 150–350 words. Split anything past ~500.
- Open with the point. The first sentence defines or claims something, with the
  key term in **bold** on first use.
- Show before you tell: a concrete example (code, a scenario, a comparison of
  "Test case 1" and "Test case 2") comes before the principle it illustrates.
- Close with one bridge sentence to the next lesson ("Next, we'll ...").
- Use `###` for the rare sub-heading. The lesson title comes from `course.json`,
  so the file starts with prose.
- Code blocks carry a language tag and, when it helps, a first-line comment
  naming the file (`// login.service.spec.ts`).
- Images live in `public/images/<course>/` and use
  `<img src={'/images/<course>/<file>.png'} alt={'...'} width={...} height={...} />`
  with the real pixel size. Alt text describes what the image shows, step by
  step, so the lesson still works without it.

## Pop questions

A `<PopQuestion>` checks the idea the learner just read, placed right after it.
The learner must answer every pop question in a lesson before marking it
complete.

- `id` is `pq-<lesson-topic>`, unique across all courses, written as
  `id={'pq-...'}`.
- Every option gets `feedback` saying why it is right or wrong. Use
  `explanation` alone only when one shared answer covers every option.
- Wrong options are plausible answers a learner might hold, not filler.
- In `prompt`, `feedback`, and `explanation`, `**bold**` is the only formatting
  that renders.
- Keep the Prettier layout: one prop per line and `/>` on its own line.
  `pnpm course:check` reads the IDs from that layout.

## Quizzes

- `intro` is one sentence naming what the quiz reviews.
- `passThreshold` is `0.5` unless the author asks otherwise.
- Use `kind: "multiple"` only when more than one option is correct, and say so
  in the prompt ("Which options ...").
- Question IDs are `q1`, `q2`, ...; option IDs are `a`, `b`, `c`, ...

## Review edits

When fixing review findings, change prose only. Code blocks and the values of
`<PopQuestion>` props such as `id` and `correctOptionId` stay as they are.
