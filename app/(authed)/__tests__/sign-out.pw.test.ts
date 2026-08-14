import type { Page } from '@playwright/test';

import { stubError } from '@/app/_lib/adapter-service';
import {
  getCurrentUserAdapter,
  signOutAdapter,
} from '@/app/_lib/adapters/auth.adapters';
import { expect, test, TEST_USER } from '@/playwright/fixtures';

const COURSE_PATH = '/c/four-pillars';

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
  await page.goto(COURSE_PATH);
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
  await stubAdapter(signOutAdapter, BLANK_COOKIE);

  await signOutFromMenu(page);
  await expect(page).toHaveURL('/sign-in');

  await page.goto(COURSE_PATH);

  await expect(page).toHaveURL('/sign-in');
});

test('still lands on sign-in when the session was already invalid', async ({
  page,
  signedIn,
  stubAdapter,
}) => {
  await signedIn();
  await page.goto(COURSE_PATH);
  await page
    .getByRole('button', { name: `Account menu for ${TEST_USER.username}` })
    .click();
  await stubAdapter(
    signOutAdapter,
    stubError('UnauthenticatedError', 'Session expired')
  );
  await stubAdapter(
    getCurrentUserAdapter,
    stubError('UnauthenticatedError', 'Session expired')
  );
  await page.getByRole('menuitem', { name: 'Sign Out' }).click();

  await expect(page).toHaveURL('/sign-in');
});
