import { expect, test } from '@/playwright/fixtures';

const COURSE_PATH = '/c/four-pillars';
const LESSON_PATH = '/c/four-pillars/introduction/what-you-ll-learn';

test('shows the course panel only on lesson pages', async ({
  page,
  signedIn,
}) => {
  await signedIn();

  await page.goto(COURSE_PATH);

  await expect(page.locator('#course-panel')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Lessons', exact: true })
  ).toHaveCount(0);

  await page.goto(LESSON_PATH);

  const lessonsToggle = page.getByRole('button', {
    name: 'Lessons',
    exact: true,
  });
  await expect(lessonsToggle).toBeVisible();
  await lessonsToggle.click();

  const coursePanel = page.locator('#course-panel');
  await expect(coursePanel).toBeVisible();
  await expect(
    coursePanel.getByRole('link', { name: /What you'll learn/ })
  ).toHaveAttribute('aria-current', 'page');

  await page.getByRole('link', { name: 'Back to course' }).click();

  await expect(page).toHaveURL(COURSE_PATH);
  await expect(coursePanel).toHaveCount(0);
  await expect(lessonsToggle).toHaveCount(0);
});
