import { expect, test } from '@playwright/test';

test('learner happy path smoke: catalog to playback', async ({ page }) => {
  await page.goto('/events/flix-mvp-launch-event');

  await expect(page.getByRole('heading', { name: 'Flix', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Catalog Access' })).toBeVisible();

  const lessonLink = page.locator('a[href*="/events/flix-mvp-launch-event/lessons/"]').first();
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await page.getByRole('button', { name: 'Load catalog' }).click();
    try {
      await expect(lessonLink).toBeVisible({ timeout: 8_000 });
      break;
    } catch (error) {
      if (attempt === 3) {
        throw error;
      }
      await page.waitForTimeout(1_000);
    }
  }

  await lessonLink.click();
  await expect(page.getByRole('heading', { name: 'Lesson Playback' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Lesson Materials' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lesson Quiz' })).toBeVisible();
});
