import { stubError } from '@/app/_lib/adapter-service';
import {
  getCurrentUserAdapter,
  signUpAdapter,
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

const NEW_SESSION = {
  cookie: stubbedSessionCookie,
  session: { id: 'stubbed-session', userId: 'user-1', expiresAt: new Date(0) },
  user: { id: 'user-1', username: TEST_USER.username },
};

async function submit(
  page: Parameters<typeof alerts>[0],
  { password = 'password', confirm = 'password' } = {}
) {
  await page.goto('/sign-up');
  await page.fill('input[name="username"]', TEST_USER.username);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirm_password"]', confirm);
  await page.click('button[type="submit"]');
}

test('creates an account and lands in the app', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(signUpAdapter, NEW_SESSION);
  await stubAdapter(getCurrentUserAdapter, TEST_USER);
  await stubAdapter(getCourseProgressAdapter, EMPTY_COURSE_PROGRESS);

  await submit(page);

  await expect(
    page.getByRole('heading', { name: `Welcome, ${TEST_USER.username}.` })
  ).toBeVisible();
  await expect(page).toHaveURL('/c/four-pillars');
});

test('reports a taken username', async ({ page, stubAdapter }) => {
  await stubAdapter(
    signUpAdapter,
    stubError('AuthenticationError', 'Username taken')
  );

  await submit(page);

  await expect(alerts(page)).toHaveText('Username taken');
  await expect(page).toHaveURL('/sign-up');
});

test('hides internal detail when sign-up fails unexpectedly', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signUpAdapter,
    stubError('DatabaseOperationError', 'connection refused at 10.0.0.4:5432')
  );

  await submit(page);

  await expect(alerts(page)).toHaveText(
    'An error happened. The developers have been notified. Please try again later.'
  );
  await expect(alerts(page)).not.toContainText('10.0.0.4');
});

test('reports rejected input as a bounds message', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signUpAdapter,
    stubError('InputParseError', 'Invalid data')
  );

  await submit(page);

  await expect(alerts(page)).toHaveText(
    'Use a username of 3–31 characters and a password of 6–31 characters.'
  );
});

test('reselects the username after a failure', async ({
  page,
  stubAdapter,
}) => {
  await stubAdapter(
    signUpAdapter,
    stubError('AuthenticationError', 'Username taken')
  );

  await submit(page);

  const username = page.locator('input[name="username"]');
  await expect(username).toBeFocused();
  await expect
    .poll(() =>
      username.evaluate(
        (input: HTMLInputElement) =>
          input.selectionEnd! - input.selectionStart! === input.value.length
      )
    )
    .toBe(true);
});

test('rejects mismatched passwords without calling the server', async ({
  page,
}) => {
  await submit(page, { password: 'password', confirm: 'different' });

  const confirm = page.locator('input[name="confirm_password"]');
  await expect(page.locator('#confirm-password-message')).toHaveText(
    'Passwords do not match.'
  );
  await expect(confirm).toHaveAttribute('aria-invalid', 'true');
  await expect(confirm).toBeFocused();
  await expect(page).toHaveURL('/sign-up');
});

test('clears the mismatch message once the confirm field changes', async ({
  page,
}) => {
  await submit(page, { password: 'password', confirm: 'different' });
  await expect(page.locator('#confirm-password-message')).toBeVisible();

  await page.fill('input[name="confirm_password"]', 'password');

  await expect(page.locator('#confirm-password-message')).toHaveCount(0);
});

test('reveals each password field independently', async ({ page }) => {
  await page.goto('/sign-up');

  const password = page.locator('input[name="password"]');
  const confirm = page.locator('input[name="confirm_password"]');
  const toggles = page.getByRole('button', { name: 'Show password' });

  await toggles.first().click();

  await expect(password).toHaveAttribute('type', 'text');
  await expect(confirm).toHaveAttribute('type', 'password');
});
