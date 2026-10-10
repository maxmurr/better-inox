---
name: create-course
description:
  Author a mini course in content/ (outline, MDX lessons, pop questions,
  quizzes). Use when asked to create, draft, or extend a course, or to add a
  lesson or quiz.
---

# Create a course

The exemplar is `content/four-pillars/`. Before writing, read its `course.json`,
two lessons, one lesson with a `<PopQuestion>`, and one `.quiz.json`. Match its
shape, lesson length, and voice.

The format is defined in code; read it there:

- `src/entities/models/course.ts`: `course.json`
- `src/entities/models/quiz.ts` (`quizSchema`): `<lesson>.quiz.json`
- `app/_components/pop-question.tsx`: `<PopQuestion>` props
- `mdx-components.tsx`: everything a lesson can render

```
content/<course>/course.json                     title, sections, lessons
content/<course>/<section>/<lesson>.mdx          written lesson
content/<course>/<section>/<lesson>.quiz.json    quiz lesson
public/images/<course>/                          lesson images
```

A course is served at `/c/<course>`. The app has no course list yet, so learners
reach a new course by that link.

Lesson IDs (`<section>/<lesson>`) are saved with learner progress. When
extending a course, add new slugs and leave existing ones exactly as they are.

## Steps

1. **Brief.** Ask the author for topic, audience, and source material. Done when
   you state 3–5 learning outcomes and the author confirms them.
2. **Outline.** Write `course.json`. Each section teaches one outcome and ends
   with a quiz lesson. Done when the author approves the outline.
3. **Lessons.** Invoke the `writing-quality` skill and read
   [STYLE.md](STYLE.md). Write one `.mdx` per non-quiz lesson, a section at a
   time. Done when every outline lesson has a file and every outcome is taught
   by at least one lesson.
4. **Quizzes.** Write one `.quiz.json` per quiz lesson. Done when every question
   maps to an outcome from the brief.
5. **Review.** Invoke the `writing-guidelines` skill on
   `content/<course>/**/*.mdx` and fix each finding in the prose. Done when a
   re-run reports zero findings.
6. **Check.** Run `pnpm course:check`. Done when it is green. If the app runs
   locally, open `/c/<course>` and click through one lesson and one quiz.
