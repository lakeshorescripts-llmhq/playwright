import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { ClearTheList } from '../../pages/ClearTheList';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(60000);

test('REGRESSION - CLEAR THE LIST FUNCTIONALITY', async ({ page }) => {
  const home = new HomePage(page);
  const ctl = new ClearTheList(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);

  const signedIn = dataVariables.playwright;
  const search = dataVariables.skuSearch;

  try {
    console.log('🔄 Navigating to Clear The List page...');
    await ctl.navigateTo();
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/clear-the-list/i);

    console.log('✅ Clicking X button to close the consent banner...');
    await home.closeConsentBanner();

    console.log('👤 Clicking Create A List as a guest...');
    await ctl.createAListButton();
    await expect(page.locator('#emailId')).toBeVisible();

    console.log('🔐 Signing in...');
    await home.signInFromHeader();
    await home.enterSignInCredentials(signedIn);
    const accountIcon = page.getByTestId('signin-icon-link').nth(0);
    await accountIcon.click();
    await expect(page).toHaveURL(/my-account/);

    console.log('🛒 Emptying cart...');
    await cart.emptyCart();

    console.log(' Deleting all existing lists...')
    await ctl.deleteList();
    await expect(page.getByRole('heading', { name: /It doesn’t look like you’ve/ })).toBeVisible();

    console.log('🔄 Navigating back to Clear The List landing page...');
    await home.navigateToCTL();
    await expect(page).toHaveTitle(/Clear the List/);

    console.log('📝 Starting your list...');
    await ctl.startYourList();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // buffer for UI animations
    //await page.locator('#your-modal-container').waitFor({ state: 'visible', timeout: 10000 });
    await page.getByRole('button', { name: 'Create List' }).waitFor({ state: 'visible', timeout: 10000 });
    
    await ctl.enterCreateCTLInfo();
    await expect(page.locator('#list-header-container')).toBeVisible({ timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');
    
    console.log('🏠 Navigating to homepage...');
    await home.navigateTo();
    await page.waitForLoadState('domcontentloaded');

    console.log(`🔍 Searching for SKU: ${search}`);
    await home.performSearch(search);
    
    console.log('➕ Adding product to Clear The List...');
    await product.clickAddToList();
    await expect(page).toHaveURL(/my-shoppinglist-page/);

    console.log('🔄 Navigating to Clear The List page...');
    await ctl.navigateTo();
    // Wait for the page to be fully parsed
    await page.waitForLoadState('domcontentloaded');
    // Assert the URL contains the expected path
    await expect(page).toHaveURL(/\/clear-the-list/i);

        console.log('🔍 Finding a Clear The List...');
    await ctl.FindClearTheList();
    await expect(page.getByText('playwright user')).toBeVisible();

    console.log('🗑️ Deleting All Lists...');
    await ctl.deleteList();
    await expect(page.getByRole('heading', { name: /It doesn’t look like you’ve/ })).toBeVisible();

    console.log('🚪 Signing out...');
    await home.signOutFromHeader();


    } catch (error) {
  const err = error as Error;
  console.error('❌ Test failed due to:', err.message);
  throw err;
}

});
