import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';
import { locators } from '../../test-data/locators';

test.setTimeout(60000);

test.use({
  viewport: { width: 1920, height: 1080 },
});

console.log('E2E 4 - FURNITURE TAB - GUEST - BROWSE - ORDER LEVEL COUPON');

test('E2E 4 - FURNITURE TAB - GUEST - BROWSE - ORDER LEVEL COUPON', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  
  const mainNavCategory = locators.furnitureTypes; // Change this to test different main navigation categories: shopAll, shopByGrade, anotherCategory
  const categoryLink = locators.RoomDividers; // Change this to test different categories: activePlay, anotherCategory
  const productNameLink = dataVariables.FurnitureTab; // Change this to test different product names: productNameLink
  const productOption = dataVariables.FurnitureTab;
  const coupon = dataVariables.tieredCoupon
  const creditCard = dataVariables.mastercard; // Change this to test different cards: visa, mastercard, amex, discover
  const emailContact = dataVariables.emailContact1; // Change this to test different emails: emailContact1, emailContact2
  const deliveryAdd = dataVariables.noSalesTax; // Change this to test different addresses: contiguous, noncontiguous
  const shippingOption = dataVariables.standard; // Change this to test different shipping options: standard, secondDayAir, nextDayAir, priority

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.clickLakeshoreFurnitureTab();
    await home.hoverMainNavLink(mainNavCategory);
    await home.selectCategoryLink(categoryLink);
    await category.selectProductNameLink(productNameLink);
    await product.selectProductOption(productOption);
    await product.addToCart();
    await product.viewCart();
    await cart.applyCoupon(coupon.name);
    await cart.checkout();
    await checkout.fillEmailAddress(emailContact);
    await checkout.fillDeliveryAddress(deliveryAdd);
    await checkout.selectShippingOption(shippingOption);
    await checkout.fillCreditCardPaymentInfo(creditCard);
    await checkout.submitOrder('$31.98');
    await checkout.verifyThankYouPage('$31.98');

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});