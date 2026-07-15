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
