import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import boundaries from 'eslint-plugin-boundaries';
import drizzle from 'eslint-plugin-drizzle';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      '.next-test/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'drizzle/**',
      '__tests__/coverage/**',
      'playwright-report/**',
      'test-results/**',
      'blob-report/**',
    ],
  },
  ...nextCoreWebVitals,
  {
    files: ['app/**/*.ts', 'app/**/*.tsx'],
    ignores: ['app/_lib/adapters/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='getInjection']",
          message:
            'Resolve DI dependencies inside app/_lib/adapters, then import an adapter into app code.',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { drizzle },
    rules: {
      'drizzle/enforce-delete-with-where': [
        'error',
        { drizzleObjectName: ['db', 'tx', 'invoker'] },
      ],
      'drizzle/enforce-update-with-where': [
        'error',
        { drizzleObjectName: ['db', 'tx', 'invoker'] },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { 'better-tailwindcss': betterTailwindcss },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/globals.css',
      },
    },
    rules: {
      ...betterTailwindcss.configs['correctness-warn'].rules,
      'better-tailwindcss/no-unknown-classes': [
        'warn',
        { ignore: ['toaster'] },
      ],
    },
  },
  {
    plugins: { boundaries },
    settings: {
      'boundaries/include': ['src/**/*', 'app/**/*', 'di/**/*'],
      'boundaries/elements': [
        {
          partialMatch: false,
          type: 'web',
          pattern: ['app'],
        },
        {
          partialMatch: false,
          type: 'controllers',
          pattern: ['src/interface-adapters/controllers'],
        },
        {
          partialMatch: false,
          type: 'use-cases',
          pattern: ['src/application/use-cases'],
        },
        {
          partialMatch: false,
          type: 'service-interfaces',
          pattern: ['src/application/services'],
        },
        {
          partialMatch: false,
          type: 'repository-interfaces',
          pattern: ['src/application/repositories'],
        },
        {
          partialMatch: false,
          type: 'entities',
          pattern: ['src/entities'],
        },
        {
          partialMatch: false,
          type: 'infrastructure',
          pattern: ['src/infrastructure'],
        },
        {
          partialMatch: false,
          type: 'di',
          pattern: ['di'],
        },
      ],
    },
    rules: {
      'boundaries/no-unknown-dependencies': 'error',
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'web' } },
              allow: {
                to: {
                  element: { types: { anyOf: ['web', 'entities', 'di'] } },
                },
              },
            },
            {
              from: { element: { type: 'controllers' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        'entities',
                        'service-interfaces',
                        'repository-interfaces',
                        'use-cases',
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: 'infrastructure' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        'service-interfaces',
                        'repository-interfaces',
                        'entities',
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: 'use-cases' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        'entities',
                        'service-interfaces',
                        'repository-interfaces',
                      ],
                    },
                  },
                },
              },
            },
            {
              from: { element: { type: 'service-interfaces' } },
              allow: { to: { element: { type: 'entities' } } },
            },
            {
              from: { element: { type: 'repository-interfaces' } },
              allow: { to: { element: { type: 'entities' } } },
            },
            {
              from: { element: { type: 'entities' } },
              allow: { to: { element: { type: 'entities' } } },
            },
            {
              from: { element: { type: 'di' } },
              allow: {
                to: {
                  element: {
                    types: {
                      anyOf: [
                        'di',
                        'controllers',
                        'service-interfaces',
                        'repository-interfaces',
                        'use-cases',
                        'infrastructure',
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
