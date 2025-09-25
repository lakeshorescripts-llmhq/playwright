import { test, devices } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { MyOrdersPage } from '../../pages/MyOrdersPage';
import { dataVariables } from '../../test-data/dataVariables';
import { locators } from '../../test-data/locators';

test.setTimeout(60000);

test.use({
  ...devices['Pixel 5'],
  //...devices['iPhone 14'],
  isMobile: true,
  hasTouch: true,
});

console.log('E2E 6 - ANDROID PHONE - SIGNED IN - BROWSE - FILTER');

test('E2E 6 - ANDROID PHONE - SIGNED IN - BROWSE - FILTER', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');

  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const checkout = new CheckoutPage(page);
  const orders = new MyOrdersPage(page);  

  const narrowByFilter = locators.mobileNarrowByCategories;
  const filterOption = locators.BalanceAndCoordination;
  const productNameLink = dataVariables.CW527; // Change this to test different product names: productNameLink
  const productDropdown = dataVariables.CW527;
  const emailContact = dataVariables.playwright1; // Change this to test different emails: emailContact1, emailContact2
  const billingAdd = dataVariables.billingAdd; // Change this to test different addresses: contiguous, noncontiguous

  try {

    await home.navigateHP();
    await home.closeConsentBanner();
    await home.mobileClickNavButton();
    await category.mobileFilterLink();
    await category.mobileSelectNarrowByFilter(narrowByFilter);
    await category.mobileSelectFilterOption(filterOption);
    await category.mobileSelectViewResultsButton();
    await category.selectProductNameLink(productNameLink);
    await product.selectProductOption(productDropdown);
    await product.addToCart();
    await product.clickCheckoutButton();
    await checkout.signIn(emailContact);
    await checkout.submitOrder('31.29')
    await checkout.verifyThankYouPage('$31.29');
    await home.clickOrdersLink();
    await orders.clickOrderNumber('$31.29');
    await orders.verifyBillingInfo(billingAdd);
    await orders.verifyTotalAmount('$31.29');
    await home.signOutFromHeader();

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});