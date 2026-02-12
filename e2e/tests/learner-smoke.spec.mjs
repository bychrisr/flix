import { expect, test } from '@playwright/test';

test('learner happy path smoke: catalog to playback', async ({ page }) => {
  await page.goto('/events/flix-mvp-launch-event');

  await expect(page.getByRole('heading', { name: 'Flix Learner' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Catalog Access' })).toBeVisible();
  await page.getByRole('button', { name: 'Load catalog' }).click();

  const lessonLink = page.locator('a[href="/events/flix-mvp-launch-event/lessons/kickoff-do-mvp"]');
  await expect(lessonLink).toBeVisible({ timeout: 20_000 });

  await lessonLink.click();
  await expect(page.getByRole('heading', { name: 'Lesson Playback' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Lesson Materials' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lesson Quiz' })).toBeVisible();
});
