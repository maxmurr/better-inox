import Link from 'next/link';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/app/_components/ui/card';
import { Separator } from '@/app/_components/ui/separator';
import { cn } from '@/app/_components/utils';

export function AuthCard({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-md [--card-spacing:--spacing(6)]">
      <CardHeader>
        <h1 className="font-heading text-xl/snug font-semibold tracking-tight text-balance text-foreground">
          {title}
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-6">{children}</CardContent>
      <CardFooter className="flex-wrap justify-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {footer}
      </CardFooter>
    </Card>
  );
}

export function AuthLink({
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        'rounded-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors outline-none hover:decoration-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
        className
      )}
      {...props}
    />
  );
}
