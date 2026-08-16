'use client';

import type { CSSProperties } from 'react';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

type SonnerCssProperties = CSSProperties & {
  '--normal-bg': string;
  '--normal-text': string;
  '--normal-border': string;
  '--border-radius': string;
};

const SONNER_CSS_PROPERTIES: SonnerCssProperties = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
  '--border-radius': 'var(--radius)',
};

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="group toaster"
      icons={{
        success: <CircleCheckIcon aria-hidden className="size-4" />,
        info: <InfoIcon aria-hidden className="size-4" />,
        warning: <TriangleAlertIcon aria-hidden className="size-4" />,
        error: <OctagonXIcon aria-hidden className="size-4" />,
        loading: (
          <Loader2Icon
            aria-hidden
            className="size-4 animate-spin motion-reduce:animate-none"
          />
        ),
      }}
      style={SONNER_CSS_PROPERTIES}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
