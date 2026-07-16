import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Portfolio E2E', () => {
  test('page loads and shows boot screen', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#root')).toBeAttached();
  });

  test('no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((v) => v.impact === 'critical')).toHaveLength(0);
  });
});
