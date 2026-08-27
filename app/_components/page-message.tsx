import { cn } from '@/app/_components/utils';

type PageMessageProps = Omit<React.ComponentProps<'main'>, 'title'> & {
  title: React.ReactNode;
  description: React.ReactNode;
};

/** Renders a centered full-page status message with an action. */
export function PageMessage({
  children,
  className,
  description,
  title,
  ...props
}: PageMessageProps) {
  return (
    <main
      id="main-content"
      className={cn(
        'flex max-w-md flex-col items-center gap-4 text-center',
        className
      )}
      {...props}
    >
      <h1 className="font-heading text-xl/snug font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="text-sm text-pretty text-muted-foreground">{description}</p>
      {children}
    </main>
  );
}
