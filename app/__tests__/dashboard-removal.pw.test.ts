import { expect, test } from '@/playwright/fixtures';

const REMOVED_DASHBOARD_ROUTES = ['/dashboard', '/dashboard/users'] as const;

for (const path of REMOVED_DASHBOARD_ROUTES) {
  test(`${path} returns the standard 404 while signed out`, async ({
    page,
  }) => {
    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole('heading', { name: 'Page not found' })
    ).toBeVisible();
  });

  test(`${path} returns the standard 404 while signed in`, async ({
    page,
    signedIn,
  }) => {
    await signedIn();

    const response = await page.goto(path);

    expect(response?.status()).toBe(404);
    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole('heading', { name: 'Page not found' })
    ).toBeVisible();
  });
}
