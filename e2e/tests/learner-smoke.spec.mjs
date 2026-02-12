import { expect, test } from '@playwright/test';

test('learner happy path smoke: catalog to playback', async ({ page }) => {
  await page.goto('/events/flix-mvp-launch-event');

  await expect(page.getByRole('button', { name: 'Assistir Aula' })).toBeVisible();
  await expect(page.getByText('Próximas Aulas')).toBeVisible();

  await page.getByRole('button', { name: 'Assistir Aula' }).click();
  await expect(page.getByRole('heading', { name: 'Lesson Playback' })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Lesson Materials' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Lesson Quiz' })).toBeVisible();
});
