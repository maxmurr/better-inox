import { z } from 'zod';

// Slugs become URL segments and content file paths, so they never contain
// path separators or dots.
export const courseSlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slugs use lowercase kebab-case');

function uniqueSlugs(
  items: readonly { slug: string }[],
  context: z.RefinementCtx,
  path: string
) {
  const slugs = items.map(({ slug }) => slug);
  if (new Set(slugs).size !== slugs.length) {
    context.addIssue({
      code: 'custom',
      message: `${path} slugs must be unique`,
      path: [path],
    });
  }
}

const courseLessonOutlineSchema = z.object({
  slug: courseSlugSchema,
  title: z.string().min(1),
});

const courseSectionOutlineSchema = z
  .object({
    slug: courseSlugSchema,
    title: z.string().min(1),
    lessons: z.array(courseLessonOutlineSchema).min(1),
  })
  .superRefine((section, context) =>
    uniqueSlugs(section.lessons, context, 'lessons')
  );

/** Shape of `content/<course>/course.json`. */
export const courseOutlineSchema = z
  .object({
    title: z.string().min(1),
    sections: z.array(courseSectionOutlineSchema).min(1),
  })
  .superRefine((course, context) =>
    uniqueSlugs(course.sections, context, 'sections')
  );
export type CourseOutline = z.infer<typeof courseOutlineSchema>;
