import type { MDXComponents } from 'mdx/types';

import { PopQuestion } from '@/app/_components/pop-question';
import { cn } from '@/app/_components/utils';

/**
 * Global MDX components. Lesson prose is laid out by the flex column that wraps
 * `<Content />`, so block elements carry no vertical margins of their own.
 */
const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-2 font-heading text-xl font-semibold tracking-tight text-balance text-foreground"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-2 font-heading text-lg/snug font-medium tracking-tight text-balance text-foreground"
      {...props}
    />
  ),
  p: (props) => (
    <p className="leading-relaxed text-pretty text-foreground" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-primary underline underline-offset-4 outline-none hover:no-underline focus-visible:rounded-sm focus-visible:ring-3 focus-visible:ring-ring/50"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="flex list-disc flex-col gap-2 pl-5 leading-relaxed text-pretty text-foreground"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="flex list-decimal flex-col gap-2 pl-5 leading-relaxed text-pretty text-foreground"
      {...props}
    />
  ),
  li: (props) => (
    <li className="pl-1 marker:text-muted-foreground" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
      className="flex flex-col gap-2 border-l-2 border-border pl-4 text-pretty text-muted-foreground italic"
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        'rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-foreground',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, tabIndex = 0, ...props }) => (
    <pre
      className={cn(
        'code-highlight relative overflow-x-auto rounded-xl bg-code p-4 font-mono text-base/7 [tab-size:2] text-code-foreground ring-1 ring-code-border focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-5 sm:text-sm/6 [&_code]:rounded-none [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit',
        className
      )}
      tabIndex={tabIndex}
      {...props}
    />
  ),
  img: ({ alt = '', ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-auto w-full rounded-xl border border-border"
      {...props}
    />
  ),
  hr: (props) => <hr className="border-border" {...props} />,
  PopQuestion,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
