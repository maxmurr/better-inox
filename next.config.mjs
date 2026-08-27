import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const withMDX = createMDX({
  options: {
    remarkPlugins: ['@sugar-high/remark'],
  },
});

function warnOnMissingBuildEnv() {
  if (process.env.__BUILD_ENV_CHECKED) {
    return;
  }
  process.env.__BUILD_ENV_CHECKED = '1';

  if (!process.env.RAILWAY_GIT_COMMIT_SHA) {
    console.warn(
      '[build] RAILWAY_GIT_COMMIT_SHA is unset — deploymentId is undefined and version skew protection is disabled'
    );
  }
  if (!process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY) {
    console.warn(
      '[build] NEXT_SERVER_ACTIONS_ENCRYPTION_KEY is unset — a new key is generated for this build'
    );
  }
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn(
      '[build] NEXT_PUBLIC_SENTRY_DSN is unset — browser error reporting is disabled in this build'
    );
  }
}

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.NEXT_TEST_DIST_DIR ?? '.next',
  outputFileTracingIncludes: {
    '/*': ['./drizzle/migrations/**/*'],
  },
  deploymentId: process.env.RAILWAY_GIT_COMMIT_SHA,
  poweredByHeader: false,
  typedRoutes: true,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

const sentryConfig = withSentryConfig(withMDX(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'inoxth',
  project: 'better-inox',

  // An auth token is required for uploading source maps.
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js proxy, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // These options only apply to Webpack builds (`next build --webpack`). Next.js 16
  // builds with Turbopack by default, where they are ignored.
  webpack: {
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
});

export default function config(phase) {
  if (phase === 'phase-production-build' && process.argv.includes('build')) {
    warnOnMissingBuildEnv();
  }

  return sentryConfig;
}
