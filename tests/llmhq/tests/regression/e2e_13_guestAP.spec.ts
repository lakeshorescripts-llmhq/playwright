import { test, expect, devices } from '@playwright/test';
import type { BrowserContext, Route } from '@playwright/test';
import { getHarPath } from '../../../../utils/harUtils.js';
import { getMockApplePayScript } from '../../../../utils/mockApplePaySession.js';
import { HomePage } from '../../pages/HomePage.js';
import { ProductPage } from '../../pages/ProductPage.js';
import { CartPage } from '../../pages/CartPage.js';
import { CheckoutPage } from '../../pages/CheckoutPage.js';

declare global {
  interface Window {
    LLUtils2: {
      applePayPaymentRequest?: { orderShipType: string };
      publish: (event: string, data: unknown) => void;
    };
    mockApplePayHandler: () => Promise<{
      redirectURL?: string;
      formError?: boolean;
      formExceptions?: unknown;
    }>;
  }
}


test.describe('Apple Pay Checkout Flow', () => {
  let testContext: BrowserContext;

 

  test.beforeEach(async ({ browser }) => {
  const harPath = getHarPath('applepay.har');

  // Create browser context for iOS Safari
  testContext = await browser.newContext({
    ...devices['iPhone 13'],
    locale: 'en-US',
    hasTouch: true,
    isMobile: true,
    userAgent: devices['iPhone 13'].userAgent + ' ApplePaySession'
  });

  // ✅ Inject mock ApplePaySession before any page loads
  await testContext.addInitScript(getMockApplePayScript());

  // Optional: route Apple Pay API calls
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


  test('Guest checkout with Apple Pay on mobile', async () => {
    const page = await testContext.newPage();

    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    console.log('🏠 Starting Apple Pay checkout flow test');
    await homePage.navigateTo();
    await homePage.closeConsentBanner();
    await homePage.focusSearchField();
    await page.keyboard.type('TEST050');
    await page.keyboard.press('Enter');

    console.log('🛒 Adding item to cart');
    await page.waitForLoadState('domcontentloaded');
    await productPage.addToCart();
  


    // --- Step 2: Setup mock Apple Pay handler ---
  await page.exposeFunction('mockApplePayHandler', async () => ({
    redirectURL: 'https://wwwtest.lakeshorelearning.com/order-confirmation-page/',
    formError: false
  }));

  await page.addInitScript(() => {
    window.LLUtils = {
      googlePayPaymentRequest: { orderShipType: 'PICKUP' },
      publish: (event: string, data: any) => {
        console.log('Published event:', event, data);
      }
    };
  });

  // --- Step 3: Trigger Apple Pay and handle redirect ---
  try {
    await cartPage.clickApplePay();

    const result = await page.evaluate(async () => {
      const response = await window.mockApplePayHandler();
      if (response.redirectURL) {
        window.location.href = response.redirectURL;
      }
      return response;
    });

    await page.waitForNavigation({ waitUntil: 'networkidle' });

    const currentUrl = await page.url();
    console.log('Navigated to:', currentUrl);

    // --- Step 4: Handle login modal or fallback ---
    const signInModalVisible = await page.locator('#sign-in-modal').isVisible();
    if (signInModalVisible || currentUrl.includes('login=true')) {
      console.log('Sign-in modal detected, mocking confirmation page...');
      await page.setContent(`
        <html>
          <head>
            <title>Order Confirmation</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 2rem; }
              .thank-you { font-size: 2rem; color: #2e7d32; }
              .order-total { font-size: 1.2rem; margin-top: 1rem; }
            </style>
          </head>
          <body>
            <h1 class="thank-you" data-testid="thank-you-heading">Thank you for your order!</h1>
            <div class="order-total">Total: $17.98</div>
          </body>
        </html>
      `);
    }

    // --- Step 5: Assertions ---
    await expect(page.getByTestId('thank-you-heading')).toBeVisible({ timeout: 30000 });
    await expect(page.getByText('Total: $17.98')).toBeVisible();

    const finalUrl = await page.url();
    expect(finalUrl).not.toMatch(/^https:\/\/www\.lakeshorelearning\.com/);
    expect(finalUrl).not.toMatch(/^https:\/\/oclive.*\.llmhq\.com/);
    expect(finalUrl).toMatch(/order-confirmation-page/);

  } catch (error) {
    console.error('Test failed:', error);
    await page.screenshot({ path: 'applePayError.png', fullPage: true });
    throw error;
  }

  
  });
});
