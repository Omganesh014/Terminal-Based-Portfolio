import { expect, test } from '@playwright/test';

async function unlock(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /skip boot/i }).click();
  await page.getByLabel(/unlock --session/i).fill('visitor');
  await page.getByLabel(/unlock --session/i).press('Enter');
  await expect(page.getByRole('main', { name: /OM workspace/i })).toBeVisible();
}

test('shows the login screen before unlocking', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip boot/i }).click();
  await expect(page.getByLabel(/OM login console/i)).toBeVisible();
  await expect(page.getByLabel(/unlock --session/i)).toBeVisible();
});

test('unlocks and opens a project from the main workspace', async ({ page }) => {
  await unlock(page);
  await page.getByRole('button', { name: /open projects/i }).click();
  await page.getByRole('button', { name: /SpendDay/i }).click();
  await expect(page.getByRole('heading', { name: 'SpendDay' })).toBeVisible();
  await expect(page.getByText('PROBLEM IT SOLVES')).toBeVisible();
  await page.getByRole('button', { name: /all projects/i }).click();
  await page.getByRole('button', { name: /OmOS/i }).click();
  await expect(page.getByRole('heading', { name: 'OmOS — Terminal-Based Portfolio' })).toBeVisible();
});

test('opens the live profile panel and switches themes', async ({ page }) => {
  await unlock(page);
  await page.getByRole('button', { name: /open profile/i }).click();
  await expect(page.getByText(/PROFILE \/ LIVE GITHUB/i)).toBeVisible();
  await expect(page.locator('.profile-summary')).toHaveText(/Computer Science student building practical software/i);
  await expect(page.getByRole('main', { name: /OM workspace/i })).toHaveAttribute('data-theme', 'aurora');
  await page.getByRole('button', { name: /theme: aurora/i }).click();
  await expect(page.getByRole('main', { name: /OM workspace/i })).toHaveAttribute('data-theme', 'neon');
  await page.getByRole('button', { name: /theme: neon/i }).click();
  await expect(page.getByRole('main', { name: /OM workspace/i })).toHaveAttribute('data-theme', 'midnight');
  await page.getByRole('button', { name: /theme: midnight/i }).click();
  await expect(page.getByRole('main', { name: /OM workspace/i })).toHaveAttribute('data-theme', 'ember');
});

test('opens the recruiter flow with role-based highlights', async ({ page }) => {
  await unlock(page);
  await page.getByRole('button', { name: /open recruiter/i }).click();
  await expect(page.getByText(/RECRUITER MODE \/ 3-MINUTE PATH/i)).toBeVisible();
  await page.getByRole('button', { name: 'Frontend / Product' }).click();
  await expect(page.getByText(/Terminal shell UX/i)).toBeVisible();
  await page.getByRole('button', { name: 'Backend / Systems' }).click();
  await expect(page.getByText(/Virtual filesystem/i)).toBeVisible();
});

test('enters and exits fullscreen from the login and workspace controls', async ({ page }) => {
  await unlock(page);
  await page.waitForFunction(() => document.fullscreenElement !== null);
  await page.getByRole('button', { name: /exit full screen/i }).click();
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();
});

test('shutdown leaves the portfolio page', async ({ page }) => {
  await unlock(page);
  await page.getByRole('button', { name: /shutdown/i }).click();
  await expect(page.getByText('powering off…')).toBeVisible();
  await page.waitForURL('about:blank');
});
