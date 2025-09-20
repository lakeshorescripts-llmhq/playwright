import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';
import { productData } from '../../test-data/productData';

test.setTimeout(120000);

console.log('E2E 10 - SIGNED IN - LAKESHORE BUCKS');

test('E2E 10 - SIGNED IN - LAKESHORE BUCKS', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');

  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const auth = dataVariables.loyaltyMember;
  const search = productData.gsa;

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.signInFromHeader();
    await home.enterSignInCredentials(auth);
    await cart.emptyCart();

    //const search = productData.gsa;  
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


    await home.performSearch(search.sku);
    await product.addToCart();
    await product.clickCheckoutButton();
    //await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('alert').filter({ hasText: 'Your Lakeshore Bucks have' })).toBeVisible({timeout: 5000});
    await expect(page.getByText('You have covered your balance')).toBeVisible();
    await checkout.submitOrder('$0.00');
    await checkout.verifyThankYouPage('$0.00');
    await home.signOutFromHeader();
    
    console.log('🎉 Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  }
});