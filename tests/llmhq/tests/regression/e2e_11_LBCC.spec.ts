import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(90000);

console.log('E2E 11 - SIGNED IN - LAKESHORE BUCKS - CREDIT CARD');

test('E2E 11 - SIGNED IN - LAKESHORE BUCKS - CREDIT CARD', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  // Configure tests to run serial (one after another) or parallel (same time based on # workers)
  test.describe.configure({ mode: 'serial' });
    

  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const auth = dataVariables.loyaltyMember;
  const search = dataVariables.skuSearch;

  try {
    await home.navigateTo();
    await home.closeConsentBanner();
    await home.signInFromHeader();
    await home.enterSignInCredentials(auth);
    await cart.emptyCart();

    await page.getByRole('link', { name: 'Rewards' }).first().click();
    await page.waitForTimeout(5000);
    const redeemButton = page.getByText('Redeem Points', { exact: true });
    const existingBucks = page.getByText(/Expiration Date/);

    if (!await existingBucks.isVisible()) {
        console.log('ℹ️ Redeeming reward points...');
        await redeemButton.click();
        
        const redeemModal = page.getByRole('heading', { name: 'Redeem Rewards' });
        await expect(redeemModal).toBeVisible({ timeout: 10000 });

        const tenDollarOption = page.locator('label').filter({ hasText: '$10 Lakeshore Bucks (1,000' }).locator('div');
        await tenDollarOption.click();

        const redeemConfirmButton = page.getByRole('button', { name: 'Redeem' });
        await redeemConfirmButton.click();

        await expect(page.getByText('Congratulations! You\'ve')).toBeVisible();
        console.log('✅ Points redeemed successfully');
    } else {
        console.log('ℹ️ No redeemable points or existing Lakeshore Bucks found.');
    }

    await home.performSearch(search);
    await product.addToCart();
    await product.clickCheckoutButton();
    await expect(page.getByRole('alert').filter({ hasText: 'Your Lakeshore Bucks have' })).toBeVisible();
    await checkout.submitOrder('$8.03');
    await checkout.verifyThankYouPage('$8.03');
    await home.signOutFromHeader();
    
    console.log('🎉 Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  }
});