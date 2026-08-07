import { stubError } from '@/app/_lib/adapter-service';
import {
  getCurrentUserAdapter,
  signInAdapter,
} from '@/app/_lib/adapters/auth.adapters';
import { getCourseProgressAdapter } from '@/app/_lib/adapters/course-progress.adapters';
import {
  alerts,
  EMPTY_COURSE_PROGRESS,
  expect,
  stubbedSessionCookie,
  test,
  TEST_USER,
} from '@/playwright/fixtures';

async function submit(page: Parameters<typeof alerts>[0], password: string) {
  await page.goto('/sign-in');
  await page.fill('input[name="username"]', TEST_USER.username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

test('signs in with a username and password', async ({ page, stubAdapter }) => {
  await stubAdapter(signInAdapter, stubbedSessionCookie);
  await stubAdapter(getCurrentUserAdapter, TEST_USER);
  await stubAdapter(getCourseProgressAdapter, EMPTY_COURSE_PROGRESS);

  await submit(page, 'password');

  await expect(
    page.getByRole('heading', { name: `Welcome, ${TEST_USER.username}.` })
  ).toBeVisible();
  await expect(page).toHaveURL('/c/four-pillars');
});

test('shows one message for any rejected credentials', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signInAdapter,
    stubError('AuthenticationError', 'Incorrect username or password')
  );

  await submit(page, 'wrong-password');

  await expect(alerts(page)).toHaveText('Incorrect username or password');
  await expect(page).toHaveURL('/sign-in');
});

test('hides internal detail when sign-in fails unexpectedly', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signInAdapter,
    stubError('DatabaseOperationError', 'connection refused at 10.0.0.4:5432')
  );

  await submit(page, 'password');

  await expect(alerts(page)).toHaveText(
    'An error happened. The developers have been notified. Please try again later.'
  );
  await expect(alerts(page)).not.toContainText('10.0.0.4');
});

test('reselects the password after a failure', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signInAdapter,
    stubError('AuthenticationError', 'Incorrect username or password')
  );

  await submit(page, 'wrong-password');

  const password = page.locator('input[name="password"]');
  await expect(password).toBeFocused();
  await expect
    .poll(() =>
      password.evaluate(
        (input: HTMLInputElement) =>
          input.selectionEnd! - input.selectionStart! === input.value.length
      )
    )
    .toBe(true);
});

test('focuses the username on load', async ({ page }) => {
  await page.goto('/sign-in');

  await expect(page.locator('input[name="username"]')).toBeFocused();
});

test('reveals and re-hides the password', async ({ page }) => {
  await page.goto('/sign-in');

  const password = page.locator('input[name="password"]');
  const toggle = page.getByRole('button', { name: 'Show password' });

  await expect(password).toHaveAttribute('type', 'password');

  await toggle.click();
  await expect(password).toHaveAttribute('type', 'text');
  await expect(
    page.getByRole('button', { name: 'Hide password' })
  ).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: 'Hide password' }).click();
  await expect(password).toHaveAttribute('type', 'password');
});
