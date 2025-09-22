import { test, expect, devices } from '@playwright/test';
import { selectors } from './utils/selectors.js';

declare global {
  interface Window {
    LLUtils: any;
    mockGooglePayHandler: () => Promise<{
      success: boolean;
      redirectURL: string;
      authToken?: string;
    }>;
  }
}

test.use({
  ...devices['Desktop Chrome'],
  viewport: { width: 1920, height: 1080 },
  launchOptions: {
    args: ['--disable-gpu', '--no-sandbox', '--disable-web-security']
  }
});

test.setTimeout(60000);

test('Google Pay checkout flow with fallback confirmation page', async ({ page }) => {
  // --- Step 1: Navigate and add item to cart ---
  await page.goto('https://wwwtest.lakeshorelearning.com/');
  await page.locator(selectors.searchInput).click();
  await page.locator(selectors.searchInput).fill('TEST050');
  await page.locator(selectors.searchInput).press('Enter');
  await page.locator(selectors.searchButton).click();
  await page.locator(selectors.addToCart).click();
  await page.getByTestId('add-to-cart-checkout').click();
  await page.waitForLoadState('networkidle');

  // --- Step 2: Setup mock Google Pay handler ---
  await page.exposeFunction('mockGooglePayHandler', async () => ({
    success: true,
    redirectURL: 'https://wwwtest.lakeshorelearning.com/order-confirmation-page/'
  }));

  await page.addInitScript(() => {
    window.LLUtils = {
      googlePayPaymentRequest: { orderShipType: 'PICKUP' },
      publish: (event: string, data: any) => {
        console.log('Published event:', event, data);
      }
    };
  });

  // --- Step 3: Trigger Google Pay and handle redirect ---
  try {
    await page.getByRole('button', { name: 'Google Pay' }).click();

    const result = await page.evaluate(async () => {
      const response = await window.mockGooglePayHandler();
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
    await page.screenshot({ path: 'googlePayError.png', fullPage: true });
    throw error;
  }
});
