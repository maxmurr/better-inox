import { expect, test } from '@/playwright/fixtures';

const PROTECTED = ['/', '/c/four-pillars/getting-started'] as const;

for (const path of PROTECTED) {
  test(`sends a signed-out visitor from ${path} to sign-in`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page).toHaveURL('/sign-in');
  });
}

for (const path of ['/sign-in', '/sign-up'] as const) {
  test(`leaves ${path} reachable while signed out`, async ({ page }) => {
    await page.goto(path);

    await expect(page).toHaveURL(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

for (const path of ['/sign-in', '/sign-up'] as const) {
  test(`sends a signed-in visitor from ${path} into the app`, async ({
    page,
    signedIn,
  }) => {
    await signedIn();

    await page.goto(path);

    await expect(page).toHaveURL('/c/four-pillars');
  });
}
