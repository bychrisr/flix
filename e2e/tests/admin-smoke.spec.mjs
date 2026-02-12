import { expect, test } from '@playwright/test';

test('admin happy path smoke: login and create event', async ({ page }) => {
  await page.goto('http://127.0.0.1:4174/login');

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Admin Content Operations' })).toBeVisible();

  const randomSuffix = `${Date.now()}`;
  await page.getByPlaceholder('Event title').fill(`E2E Event ${randomSuffix}`);
  await page.getByRole('textbox', { name: 'Slug', exact: true }).fill(`e2e-event-${randomSuffix}`);
  await page.getByPlaceholder('Description').fill('Smoke test event created via browser runtime');
  await page.getByPlaceholder('Hero title').fill(`Hero ${randomSuffix}`);
  await page.getByPlaceholder('Hero subtitle').fill('Subtitle for smoke validation');
  await page.getByPlaceholder('Hero CTA text').fill('Start now');

  await page.getByRole('button', { name: 'Create event' }).click();
  await expect(page.getByText('Event created successfully.')).toBeVisible();

  await expect(page.getByRole('button', { name: new RegExp(`E2E Event ${randomSuffix}`) })).toBeVisible();
});
