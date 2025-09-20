import { test, expect, devices } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(60000);

test.use({
  ...devices['iPhone 14'],
  isMobile: true,
  hasTouch: true,
});

console.log('E2E 2 - GUEST - KEYWORD SEARCH - GIFT CARD - CREDIT CARD - IPHONE - NO ORDER SUBMIT');

test('E2E 2 - GUEST - KEYWORD SEARCH - GIFT CARD - CREDIT CARD - IPHONE - NO ORDER SUBMIT', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const search = dataVariables.keywordSearch;
  const productNameLink = dataVariables.TEST050; // Change this to test different product names: productNameLink
  const creditCard = dataVariables.discover; // Change this to test different cards: visa, mastercard, amex, discover
  const emailContact = dataVariables.emailContact1; // Change this to test different emails: emailContact1, emailContact2
  const deliveryAdd = dataVariables.noncontiguous; // Change this to test different addresses: contiguous, noncontiguous
  const shippingOption = dataVariables.priority; // Change this to test different shipping options: standard, secondDayAir, nextDayAir, priority
  const giftCard = dataVariables.tenDollarGiftCard; // Change this to test different gift cards: tenDollarGiftCard, unlimitedGiftCard

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.performSearch(search);
    await category.selectProductNameLink(productNameLink);
    await product.addToCart();
    await product.viewCart();
    await cart.checkout();
    await checkout.fillEmailAddress(emailContact);
    await checkout.fillDeliveryAddress(deliveryAdd);
    await checkout.selectShippingOption(shippingOption);
    await checkout.fillCreditCardPaymentInfo(creditCard);
    await checkout.fillGiftCardPaymentInfo(giftCard);
    await expect(page.getByText('$18.19').nth(1)).toBeVisible();

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});