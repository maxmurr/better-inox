import './globals.css';

import type { Metadata, Viewport } from 'next';
import { Inter as FontSans } from 'next/font/google';
import { connection } from 'next/server';

import { Toaster } from './_components/ui/sonner';
import { TooltipProvider } from './_components/ui/tooltip';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: { default: 'better inox', template: '%s · better inox' },
  description: 'Courses and training for the Inox team.',
};

export const viewport: Viewport = {
  themeColor: '#f7f7f7',
  colorScheme: 'light',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  await connection();

  return (
    <html lang="en" className={fontSans.variable}>
      <body className="flex min-h-dvh items-center justify-center font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only rounded-lg bg-background px-3 py-2 text-sm font-medium text-foreground ring-3 ring-ring/50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to main content
        </a>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
