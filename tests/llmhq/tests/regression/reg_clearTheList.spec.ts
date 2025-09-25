import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { ClearTheList } from '../../pages/ClearTheList';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(60000);

test.use({
  viewport: { width: 1280, height: 720 },
});

test('REGRESSION - CLEAR THE LIST FUNCTIONALITY', async ({ page }) => {
  const home = new HomePage(page);
  const ctl = new ClearTheList(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  const signedIn = dataVariables.playwright;
  const search = dataVariables.skuSearch;

  try {
    await test.step('Navigate to Clear The List page', async () => {
      await ctl.navigateTo();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/clear-the-list/i);
    });

    await test.step('Close consent banner', async () => {
      await home.closeConsentBanner();
    });

    await test.step('Create a list as guest', async () => {
      await ctl.createAListButton();
      await expect(page.locator('#emailId')).toBeVisible();
    });

    await test.step('Sign in with test credentials', async () => {
      await home.signInFromHeader();
      await home.enterSignInCredentials(signedIn);
      const accountIcon = page.getByTestId('signin-icon-link').nth(0);
      await accountIcon.click();
      await expect(page).toHaveURL(/my-account/, { timeout: 10000 });
    });

    await test.step('Empty cart', async () => {
      await cart.emptyCart();
    });

    await test.step('Delete all existing lists', async () => {
      await ctl.deleteList();
      await expect(page.getByRole('heading', { name: /It doesn’t look like you’ve/ })).toBeVisible();
    });

    await test.step('Navigate back to Clear The List landing page', async () => {
      await home.navigateToCTL();
      await expect(page).toHaveTitle(/Clear the List/);
    });

    await test.step('Start a new list', async () => {
      await ctl.startYourList();
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('button', { name: 'Create List' })).toBeVisible({ timeout: 10000 });
      await ctl.enterCreateCTLInfo();
      await expect(page.locator('#list-header-container')).toBeVisible({ timeout: 10000 });
    });

    await test.step('Navigate to homepage and search for SKU', async () => {
      await home.navigateTo();
      await page.waitForLoadState('domcontentloaded');
      await home.performSearch(search);
    });

    await test.step('Add product to Clear The List', async () => {
      await product.clickAddToList();
      await expect(page).toHaveURL(/my-shoppinglist-page/);
    });

    await test.step('Navigate to Clear The List page again', async () => {
      await ctl.navigateTo();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/clear-the-list/i);
    });

    await test.step('Find the created Clear The List', async () => {
      await ctl.FindClearTheList();
      await expect(page.getByText('playwright user')).toBeVisible();
    });

    await test.step('Delete all lists again', async () => {
      await ctl.deleteList();
      await expect(page.getByRole('heading', { name: /It doesn’t look like you’ve/ })).toBeVisible();
    });

    await test.step('Sign out', async () => {
      await home.signOutFromHeader();
    });

  } catch (error) {
    console.error('❌ Test failed due to:', error);
    throw error;
  }
});
