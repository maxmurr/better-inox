import { createEnv } from '@t3-oss/env-nextjs';
import * as z from 'zod';

const sentryDsn =
  process.env.NODE_ENV === 'production'
    ? z.url()
    : z.url().optional().catch(undefined);

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    DATABASE_POOL_MAX: z.coerce.number().int().positive().default(10),
    REDIS_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.url(),
    SENTRY_DSN: sentryDsn,
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: sentryDsn,
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
