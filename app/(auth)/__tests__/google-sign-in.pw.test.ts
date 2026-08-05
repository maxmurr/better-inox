import { ALLOWED_GOOGLE_HD } from '@/config';

import { alerts, expect, test } from '@/playwright/fixtures';

const MESSAGES = {
  google_domain: `That Google account is not allowed. Sign in with your ${ALLOWED_GOOGLE_HD.join(' or ')} account.`,
  google: 'Could not sign in with Google. Please try again.',
  rate_limit: 'Too many attempts. Please try again in a few minutes.',
};

for (const [code, message] of Object.entries(MESSAGES)) {
  test(`renders the ${code} failure`, async ({ page }) => {
    await page.goto(`/sign-in?error=${code}`);

    await expect(alerts(page)).toHaveText(message);
  });
}

test('stays quiet without an error code', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(alerts(page)).toHaveCount(0);
});

test('stays quiet for an unrecognised error code', async ({ page }) => {
  await page.goto('/sign-in?error=not-a-real-code');

  await expect(alerts(page)).toHaveCount(0);
});

test('offers Google as an alternative on both pages', async ({ page }) => {
  for (const path of ['/sign-in', '/sign-up']) {
    await page.goto(path);

    await expect(
      page.getByRole('button', { name: 'Continue with Google' })
    ).toHaveAttribute('href', '/api/auth/google');
  }
});
