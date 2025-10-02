import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { StoreLocatorPage } from '../../pages/StoreLocatorPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { MyOrdersPage } from '../../pages/MyOrdersPage';
import { dataVariables } from '../../test-data/dataVariables';

test.setTimeout(90000);

console.log('E2E 5 - SIGNED IN STORE PICKUP');

test('E2E 5 - SIGNED IN STORE PICKUP', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');

  const home = new HomePage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const orders = new MyOrdersPage(page);
  const storeLocator = new StoreLocatorPage(page);

  const auth = dataVariables.playwright;
  const search = dataVariables.skuSearch;
  const addInfo = dataVariables.additionalInfo;
  const billingAdd = dataVariables.billingAdd;

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.clickStoresLinkFromHeader();
    await storeLocator.clickViewAllStoresLink();
    await storeLocator.selectStore('Carson');
    await home.signInFromHeader();
    await home.enterSignInCredentials(auth);
    await cart.emptyCart();
    await home.performSearch(search);
    await product.clickStorePickupOption();
    await product.addToCart();
    await product.clickCheckoutButton();
    await checkout.fillStorePickupInfo(addInfo);
    await checkout.submitOrder('$11.04');
    await checkout.verifyThankYouPage('$11.04');
    await home.clickOrdersLink();
    await orders.clickOrderNumber('$11.04');
    await orders.verifyBillingInfo(billingAdd, true);
    await orders.verifyTotalAmount('$11.04');
    await home.signOutFromHeader();

    console.log('🎉 Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  }
});