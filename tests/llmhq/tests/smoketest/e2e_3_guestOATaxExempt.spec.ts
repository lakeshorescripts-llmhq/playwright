import { test, devices } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(60000);

test.use({ ...devices['Samsung Galaxy Tab S7 landscape'],
  geolocation: { latitude: 48.8566, longitude: 2.3522 }, // Paris, France
  permissions: ['geolocation'],
});

console.log('E2E 3 - GUEST - SKU SEARCH - PAY ON ACCOUNT - TAX EXEMPT - ANDROID TABLET - FRANCE');

test('E2E 3 - GUEST - SKU SEARCH - PAY ON ACCOUNT - TAX EXEMPT - ANDROID TABLET - FRANCE', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const search = dataVariables.keywordSearch;
  const productNameLink = dataVariables.TEST050;
  const emailContact = dataVariables.emailContact1;
  const deliveryAdd = dataVariables.contiguous;
  const shippingOption = dataVariables.secondDayAir;
  const payOnAccount = dataVariables.payOnAccount;
  const billingAdd = dataVariables.noncontiguous;
  const coupon = dataVariables.percentOffcoupon;

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
    await checkout.enterPayOnAccountPaymentInfo(payOnAccount);
    await checkout.uncheckUseDeliveryAddressAsBilling();
    await checkout.enterBillingInfo(billingAdd);
    await checkout.applyTaxExempt();
    await checkout.applyCoupon(coupon);
    await checkout.submitOrder('$23.76');
    await checkout.verifyThankYouPage('$23.76');

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});