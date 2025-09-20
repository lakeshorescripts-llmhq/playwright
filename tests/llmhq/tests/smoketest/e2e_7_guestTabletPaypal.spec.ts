import { test, devices } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { QuickOrderPage } from '../../pages/QuickOrderPage'; // Example alternative path if needed
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(90000);

test.use({
  ...devices['Samsung Galaxy Tab S5e'],
  viewport: { width: 1024, height: 768 },
  isMobile: true,
  hasTouch: true,
  browserName: 'chromium', // This sets the browser to Chrome (Chromium-based)
  // Optionally override the user agent if needed
  // userAgent: 'Mozilla/5.0 (Linux; Android 9; SM-T720) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
});


console.log('E2E 7 - GUEST - ANDROID TABLET - PAYPAL');

test('E2E 7 - GUEST - ANDROID TABLET - PAYPAL', async ({ page }) => {
  console.log('✅ Test started: E2E - GUEST - ANDROID TABLET - PAYPAL');
  const home = new HomePage(page);
  const quickOrder = new QuickOrderPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const quickOrderInfo = dataVariables.TEST053A;

  try {
    await home.navigateHP(); // Ensure this method exists and awaits navigation
    await page.waitForTimeout(2000); // waits for 5 seconds
    await home.closeConsentBanner(); // ISSUE: does not display when extraheaders are enabled
    await home.clickQuickOrderLinkFromHeader(); // Ensure this method exists and clicks the correct element
    await quickOrder.enterQuickOrderInfo(quickOrderInfo); // Ensure this method fills in required info
    await quickOrder.clickAddToCartButton(); // Ensure this method clicks the add to cart button
    await cart.clickPayPalButton(page.context()); // Ensure this method handles PayPal flow and uses context correctly
    await checkout.submitOrder('$8.19'); // Ensure this method submits the order and waits for confirmation
    await checkout.verifyThankYouPage('$8.19'); // Ensure this method verifies the thank you page and amount

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});