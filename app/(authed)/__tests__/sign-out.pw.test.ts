import type { Page } from '@playwright/test';

import { stubError } from '@/app/_lib/adapter-service';
import { signOutAdapter } from '@/app/_lib/adapters/auth.adapters';
import { getTodosForUserAdapter } from '@/app/_lib/adapters/todos.adapters';
import { expect, test, TEST_USER } from '@/playwright/fixtures';

const BLANK_COOKIE = {
  name: 'auth_session',
  value: '',
  attributes: {
    path: '/',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 0,
  },
};

async function signOutFromMenu(page: Page) {
  await page.goto('/');
  await page
    .getByRole('button', { name: `Account menu for ${TEST_USER.username}` })
    .click();
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();
}

test('signs out from the account menu and clears the session', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(getTodosForUserAdapter, []);
  await stubAdapter(signOutAdapter, BLANK_COOKIE);

  await signOutFromMenu(page);
  await expect(page).toHaveURL('/sign-in');

  await page.goto('/c/four-pillars');

  await expect(page).toHaveURL('/sign-in');
});

test('still lands on sign-in when the session was already invalid', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await stubAdapter(getTodosForUserAdapter, []);
  await stubAdapter(
    signOutAdapter,
    stubError('UnauthenticatedError', 'Session expired')
  );

  await signOutFromMenu(page);

  await expect(page).toHaveURL('/sign-in');
});
