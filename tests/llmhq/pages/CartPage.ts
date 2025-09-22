import { Page, expect, BrowserContext, Locator } from '@playwright/test';

export class CartPage {
    constructor(private page: Page) {}

    async enterQty(quantity: { qty: number | string }) {
        console.log(`🛒 Entering quantity: ${quantity.qty}`);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(5000);

        const qtyField1_0 = this.page.getByRole('combobox').first();
        const qtyField2_0 = this.page.getByRole('spinbutton').first();

        if (await qtyField1_0.isVisible({ timeout: 5000 })) {
            await (qtyField1_0).click();
            await (qtyField1_0).selectOption(`${quantity.qty}`);
            await expect(this.page.getByText(`(${quantity.qty} items)`)).toBeVisible();
            console.log(`🛒 Quantity 1.0 updated to: ${quantity.qty}`);
        } else {
            await qtyField2_0.fill(`${quantity.qty}`);
            await qtyField2_0.press('Enter');
            await expect(this.page.getByRole('heading', { name: `My Cart (${quantity.qty})` })).toBeVisible();
            console.log(`🛒 Quantity 2.0 updated to: ${quantity.qty}`);
        }
    }

    async clickApplePay() {
        console.log('💳 Proceeding with Apple Pay...');
        await this.page.waitForLoadState('domcontentloaded');
        
        // Log all button roles for debugging
        console.log('🔍 Looking for payment buttons...');
        const buttons = await this.page.getByRole('button').all();
        for (const button of buttons) {
            const name = await button.getAttribute('name') || await button.innerText();
            console.log(`Found button: ${name}`);
        }
        
        // Try different selectors for Apple Pay button
        const selectors = [
            this.page.getByRole('button', { name: 'Apple Pay' }),
            this.page.locator('button:has-text("Apple Pay")'),
            this.page.locator('[aria-label="Apple Pay"]'),
            this.page.locator('.apple-pay-button')
        ];
        
        let applePayButton;
        for (const selector of selectors) {
            if (await selector.isVisible({ timeout: 2000 }).catch(() => false)) {
                applePayButton = selector;
                console.log('✅ Found Apple Pay button!');
                break;
            }
        }
        
        if (!applePayButton) {
            throw new Error('Apple Pay button not found after trying multiple selectors');
        }
        
        await applePayButton.click();
    }

    async checkout() {
        console.log('🛒 Proceeding to checkout...');
        const checkout = this.page.getByRole('button', { name: 'Checkout' });
        await expect(checkout).toBeVisible();
        await expect(checkout).toBeEnabled();
        await checkout.click();
        await expect(this.page).toHaveURL(/checkout/);
    }

    async applyCoupon(couponCode: string, successMessage?: string): Promise<boolean> {
        console.log(`🛒 Applying coupon code: "${couponCode}"`);
        const message = successMessage ?? `Promo Code ${couponCode} has been applied.`;
        const couponField = this.page.getByRole('textbox', { name: 'Enter Coupon Code' });
        const applyButton = this.page.getByRole('button', { name: 'Apply' });
    
        try {
            await expect(couponField).toBeVisible({ timeout: 10000 });
            await couponField.fill(couponCode);
            await expect(applyButton).toBeEnabled();
            await applyButton.click();
    
            const confirmation = this.page.getByText(message, { exact: false });
            await expect(confirmation).toBeVisible({ timeout: 10000 });
    
            console.log(`✅ Coupon "${couponCode}" applied successfully.`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to apply coupon "${couponCode}".`, error);
            return false;
        }
    }

    async emptyCart() {
        console.log('🛒 Emptying the cart...');
        await this.page.goto('/shopping-cart/');
        await this.page.waitForLoadState('domcontentloaded');

        const emptyCartMessage = this.page.getByRole('heading', { name: 'An empty cart is full of' }).first();
        const isCartEmpty = await emptyCartMessage.isVisible();
        await this.page.waitForTimeout(2000);

        if (isCartEmpty) {
            console.log('🛒 Cart is already empty.');
            return;
        }

        while (!(await emptyCartMessage.isVisible())) {
            const ellipsesShip = this.page.locator('#shipItem-0-actions').nth(0);
            const ellipsesStore = this.page.locator('#storePickup-0-actions').nth(0);
            const ellipsesEmail = this.page.locator('#emailDelivery-0-actions').nth(0);

            if (await ellipsesShip.isVisible()) {
                await ellipsesShip.click();
                await this.page.getByRole('button', { name: 'Remove Item' }).click();
                await expect(this.page.getByRole('button', { name: 'Remove Item' })).toBeHidden();
            } else if (await ellipsesStore.isVisible()) {
                await ellipsesStore.click();
                await this.page.getByRole('button', { name: 'Remove Item' }).click();
                await expect(this.page.getByRole('button', { name: 'Remove Item' })).toBeHidden();
            } else if (await ellipsesEmail.isVisible()) {
                await ellipsesEmail.click();
                await this.page.getByRole('button', { name: 'Remove Item' }).click();
                await expect(this.page.getByRole('button', { name: 'Remove Item' })).toBeHidden();
            }
        }

        await this.page.waitForTimeout(1000);
        const finalCheck = await emptyCartMessage.isVisible();

        if (!finalCheck) {
            throw new Error('Cart is not empty after attempting to remove all items.');
        }

        console.log('🛒 Cart is now empty.');
    }

    async clickPayPalButton(browserContext: BrowserContext) {
        console.log('🛒 Clicking PayPal button...');
        const paypalFrame = await this.getPayPalIframe();
        const paypalButton = await this.getPayPalButtonFromFrame(paypalFrame);
        const newPage = await this.clickButtonAndWaitForPopup(browserContext, paypalButton);
    
        await this.page.evaluate(() => {
            window.scrollBy(0, 300);
        });
    
        await this.page.waitForTimeout(1000);
        await this.loginToPayPal(newPage);
        await this.completePayment(newPage);
        await this.waitForReturnToCheckout();
    }
    
    private async getPayPalIframe(): Promise<Page> {
        const iframeLocator = this.page.locator('iframe[name*="paypal"], iframe[src*="paypal"]').first();
        await expect(iframeLocator).toBeVisible({ timeout: 15000 });
    
        const frameHandle = await iframeLocator.elementHandle();
        const paypalFrame = await frameHandle?.contentFrame();
    
        if (!paypalFrame) throw new Error('Could not access PayPal iframe content');
    
        return paypalFrame as unknown as Page;
    }
    
    private async getPayPalButtonFromFrame(frame: Page) {
        const buttons = await frame.locator('button').allTextContents();
        console.log('Buttons found in iframe:', buttons);
    
        const paypalButton = frame.locator('[aria-label*="PayPal"], [alt*="PayPal"], img[src*="paypal"]').first();
        await paypalButton.scrollIntoViewIfNeeded();
        await expect(paypalButton).toBeVisible({ timeout: 10000 });
        await expect(paypalButton).toBeEnabled();
    
        const isObscured = await paypalButton.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            const elementAtPoint = document.elementFromPoint(x, y);
            return {
                isObscured: elementAtPoint !== el,
                obscuringTag: elementAtPoint?.tagName,
                obscuringClass: elementAtPoint?.className,
            };
        });
    
        if (isObscured.isObscured) {
            console.warn(`⚠️ PayPal button is obscured by <${isObscured.obscuringTag}>.${isObscured.obscuringClass}`);
            try {
                await paypalButton.click({ force: true });
                console.log('✅ Fallback: clicked PayPal button despite being obscured.');
            } catch (clickError) {
                console.error('❌ Fallback click failed:', clickError);
                throw new Error('PayPal button is obscured and could not be clicked.');
            }
        }
    
        await frame.waitForTimeout(1000);
        return paypalButton;
    }
    
    private async clickButtonAndWaitForPopup(browserContext: BrowserContext, button: Locator): Promise<Page> {
        // Try clicking the button and waiting for the popup
        const popupPromise = browserContext.waitForEvent('page', { timeout: 5000 });
    
        try {
            await button.click({ force: true });
        } catch {
            // If button is not clickable, try to locate it inside an iframe
            console.warn('⚠️ Button click failed, attempting to locate PayPal button inside iframe...');
            const iframeElement = await this.page.$('iframe');
            if (iframeElement) {
                const frame = await iframeElement.contentFrame();
                if (frame) {
                    const payPalButton = await frame.$('a:has-text("PayPal")');
                    if (payPalButton) {
                        await payPalButton.click();
                    } else {
                        throw new Error('❌ No visible PayPal button found inside iframe.');
                    }
                } else {
                    throw new Error('❌ Unable to access PayPal iframe content.');
                }
            } else {
                throw new Error('❌ No PayPal iframe found.');
            }
        }
    
        try {
            const newPage = await popupPromise;
            await newPage.waitForLoadState('domcontentloaded');
            console.log('Navigated to PayPal:', newPage.url());
            return newPage;
        } catch {
            console.warn('⚠️ Popup did not open immediately, checking open pages...');
            const pages = browserContext.pages();
            const paypalPage = pages.find(p => p.url().includes('paypal'));
            if (paypalPage) {
                console.log('✅ Found PayPal page via fallback.');
                return paypalPage;
            }
            throw new Error('Failed to open PayPal popup window after clicking the button.');
        }
    }
    
    private async loginToPayPal(newPage: Page) {
        const email = process.env.PAYPAL_EMAIL || 'dqueza@lakeshorelearning.com';
        const password = process.env.PAYPAL_PASSWORD || '12345678';
    
        await newPage.getByRole('textbox', { name: 'Email' }).fill(email);
        await newPage.getByRole('button', { name: 'Next' }).click();
        await newPage.waitForTimeout(3000);
    
        const usePasswordButton = newPage.getByRole('button', { name: 'Use Password Instead' });
        try {
            if (await usePasswordButton.isVisible()) {
                await usePasswordButton.click();
                await newPage.waitForTimeout(3000);
                console.log('✅ Clicked "Use Password Instead" button.');
            } else {
                console.log('ℹ️ "Use Password Instead" button is not visible, continuing...');
            }
        } catch {
            console.log('⚠️ "Use Password Instead" button not found, continuing...');
        }
    
        await newPage.getByRole('textbox', { name: 'Password' }).fill(password);
        await newPage.getByRole('button', { name: 'Log In' }).click();
        await newPage.waitForTimeout(3000);
    }
    
    private async completePayment(newPage: Page) {
        try {
            await newPage.waitForLoadState('domcontentloaded');
    
            // Optional: Log cart summary visibility
            const cartSummaryVisible = await newPage.locator('#cart-summary').isVisible().catch(() => false);
            console.log(`Cart summary visible: ${cartSummaryVisible}`);
            await newPage.screenshot({ path: 'before_payment_check.png' });
    
            // Log all button texts for diagnostics
            const allButtons = await newPage.locator('button').allTextContents();
            console.log('All button texts on PayPal page:', allButtons);
    
            // Try multiple selectors for the Pay button
            const payButton = newPage.getByRole('button', { name: /^Pay \$/ }).last();
            const payButton2 = newPage.getByTestId('submit-button-initial');
            const payButton3 = newPage.locator('button[type="submit"]');
    
            // Wait up to 20s for any Pay button to appear
            let found = false;
            for (let i = 0; i < 20; i++) {
                if (await payButton.isVisible().catch(() => false)) {
                    await expect(payButton).toBeVisible({ timeout: 10000 });
                    await payButton.click();
                    console.log('✅ Clicked Pay button by role.');
                    found = true;
                    break;
                } else if (await payButton2.isVisible().catch(() => false)) {
                    await expect(payButton2).toBeVisible({ timeout: 10000 });
                    await payButton2.click();
                    console.log('✅ Clicked Pay button by test ID.');
                    found = true;
                    break;
                } else if (await payButton3.isVisible().catch(() => false)) {
                    await expect(payButton3).toBeVisible({ timeout: 10000 });
                    await payButton3.click();
                    console.log('✅ Clicked Pay button by type submit.');
                    found = true;
                    break;
                }
                await newPage.waitForTimeout(1000); // Wait 1s before retry
            }
    
            if (!found) {
                const roleButtonCount = await newPage.getByRole('button', { name: /Pay/i }).count();
                console.log(`❌ No visible Pay button found. Role button count: ${roleButtonCount}`);
                //await newPage.screenshot({ path: 'payment_button_error.png' });
                throw new Error('❌ No visible Pay button found. All button texts: ' + JSON.stringify(allButtons));
            }
    
            await newPage.waitForLoadState('domcontentloaded');
        } catch (error) {
            console.error('❌ Failed to complete payment:', error);
            //await newPage.screenshot({ path: 'payment_button_exception.png' });
            throw error;
        }
    }
    
    private async waitForReturnToCheckout() {
        await this.page.waitForURL(/checkout-page/, { timeout: 15000 });
        await this.page.waitForLoadState('domcontentloaded');
    }
}