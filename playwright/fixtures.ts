import { test as base, type Page } from '@playwright/test';

import { SESSION_COOKIE } from '@/config';

import type {
  StubableAdapter,
  StubErrorEnvelope,
} from '@/app/_lib/adapter-service';
import { getCurrentUserAdapter } from '@/app/_lib/adapters/auth.adapters';

export const TEST_USER = { username: 'testuser', avatarUrl: null };

const STUBBED_SESSION = 'stubbed-session';

export const stubbedSessionCookie = {
  name: SESSION_COOKIE,
  value: STUBBED_SESSION,
  attributes: { path: '/', httpOnly: true, sameSite: 'lax' as const },
};

export function alerts(page: Page) {
  return page.locator('p[role="alert"]');
}

type StubAdapterFn = <TArgs extends unknown[], TResult>(
  adapter: StubableAdapter<TArgs, TResult>,
  data: TResult | StubErrorEnvelope
) => Promise<void>;

type SignedInFn = (user?: typeof TEST_USER) => Promise<void>;

export const test = base.extend<{
  stubAdapter: StubAdapterFn;
  signedIn: SignedInFn;
}>({
  stubAdapter: async ({ page }, provide) => {
    const sessionId = crypto.randomUUID();
    const stubs: Record<string, unknown> = {};

    await page.context().addCookies([
      {
        name: 'x-test-session',
        value: sessionId,
        domain: 'localhost',
        path: '/',
      },
    ]);

    const stub: StubAdapterFn = async (adapter, data) => {
      stubs[adapter.adapterName] = data;
      await page.request.post('/api/test-stubs', {
        data: { sessionId, data: stubs },
      });
    };

    await provide(stub);
  },

  signedIn: async ({ page, stubAdapter }, provide) => {
    await provide(async (user = TEST_USER) => {
      await page.context().addCookies([
        {
          name: SESSION_COOKIE,
          value: STUBBED_SESSION,
          domain: 'localhost',
          path: '/',
        },
      ]);
      await stubAdapter(getCurrentUserAdapter, user);
    });
  },
});

export { expect } from '@playwright/test';
