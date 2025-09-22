import { test, expect, devices } from '@playwright/test';
import type { BrowserContext, Route } from '@playwright/test';
import { setupBrowserContext } from './utils/browserSetup.js';
import { getHarPath } from './utils/harUtils.js';
import { HomePage } from '../../pages/HomePage.js';
import { ProductPage } from '../../pages/ProductPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';

/**
 * @mcp-test-suite ApplePay Checkout Tests
 * @mcp-suite-description End-to-end tests for Apple Pay checkout flow
 * @mcp-suite-tags @checkout @applepay @mobile @ios
 */
test.describe('Apple Pay Checkout Flow', () => {
  let testContext: any;
  
  test.beforeEach(async ({ browser }) => {
    // Setup for iOS Safari with Apple Pay
    const harPath = getHarPath('applepay.har');
    
    // Configure browser context for iOS Safari with Apple Pay support
    testContext = await browser.newContext({
      ...devices['iPhone 13'],
      locale: 'en-US',
      hasTouch: true,
      isMobile: true,
      userAgent: devices['iPhone 13'].userAgent + ' ApplePaySession'
    });
    
    // Setup HAR recording/playback and mock Apple Pay
    await testContext.route('**/api/**', async (route: Route) => {
      if (route.request().url().includes('apple-pay')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      } else {
        await route.continue();
      }
    });
  });

  test.afterEach(async () => {
    await testContext?.close();
  });

  /**
   * @mcp-test-case Complete checkout flow with Apple Pay as guest
   * @mcp-test-description Verifies the end-to-end guest checkout process using Apple Pay on mobile Safari
   * @mcp-test-tags @guest @smoke @regression @mobile @ios
   * @mcp-test-priority P0
   * @mcp-test-data-file prompt.md
   */
  test('Guest checkout with Apple Pay on mobile', async () => {
    const page = await testContext.newPage();
    
    // Initialize page objects
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('🏠 Starting Apple Pay checkout flow test');
    await homePage.navigateTo();
    await homePage.focusSearchField();
    await page.keyboard.type('TEST050');
    await page.keyboard.press('Enter');

    console.log('🛒 Adding item to cart');
    await page.waitForLoadState('domcontentloaded');
    await productPage.addToCart();
    
    // Wait for cart update
    await page.waitForLoadState('networkidle');

    console.log('💳 Proceeding with Apple Pay');
    await cartPage.clickApplePay();

    console.log('📦 Processing checkout');
    await checkoutPage.waitForCheckoutPage();

    console.log('🏠 Verifying address');
    await checkoutPage.handleAddressVerification();

    console.log('✅ Submitting order');
    await checkoutPage.submitOrder('$0.00'); // Pass expected total

    console.log('🎉 Verifying order completion');
    await checkoutPage.verifyOrderCompletion();

    console.log('✨ Test completed successfully');
  });
});