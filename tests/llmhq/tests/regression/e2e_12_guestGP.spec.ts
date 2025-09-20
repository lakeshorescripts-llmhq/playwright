import { test, expect } from '@playwright/test';
import { setupBrowserContext } from './utils/browserSetup.js';
import { getHarPath } from './utils/harUtils.js';
import { selectors } from './utils/selectors.js';

import { fileURLToPath } from 'url';
import path from 'path';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.setTimeout(120000);

test('Google Pay checkout flow with HAR recording or mocking', async () => {
  const harPath = getHarPath('googlepay.har'); // ✅ Use utility instead of manual path.resolve
  const shouldRecordHar = true;

  const { browser, context } = await setupBrowserContext(harPath, shouldRecordHar);
  const page = await context.newPage();

  await page.goto('/');
  await page.locator(selectors.searchInput).click();
  await page.locator(selectors.searchInput).fill('TEST050');
  await page.locator(selectors.searchInput).press('Enter');
  await page.locator(selectors.searchButton).click();
  await page.locator(selectors.addToCart).click();
  await page.locator(selectors.googlePayButton).click();

  await page.waitForURL(/checkout-page/);
  await page.waitForLoadState('domcontentloaded');

  const submitOrderButton = page.locator(selectors.submitOrderButton);
  await expect(submitOrderButton).toBeVisible();
  await expect(submitOrderButton).toBeEnabled();

  const url = page.url();
  expect(url).not.toMatch(/^https:\/\/www\.lakeshorelearning\.com/);
  expect(url).not.toMatch(/^https:\/\/oclive.*\.llmhq\.com/);

  await submitOrderButton.click();

  await expect(page).toHaveURL(/order-confirmation-page/, { timeout: 30000 });
  await expect(page.locator(selectors.thankYouHeading)).toBeVisible({ timeout: 10000 });

  const total = page.getByText(selectors.totalAmount).first();
  await expect(total).toBeVisible();

  await context.close();
  await browser.close();
});
