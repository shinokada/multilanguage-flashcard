import { expect, test } from '@playwright/test';

test('index page has expected h1', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Multilanguage Flashcard' })).toBeVisible();
});

test('emoji page has expected h1', async ({ page }) => {
  await page.goto('/emoji');
  await expect(page.getByRole('heading', { name: 'Emoji list' })).toBeVisible();
});
