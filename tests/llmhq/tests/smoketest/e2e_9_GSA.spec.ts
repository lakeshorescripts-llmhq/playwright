import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { MyOrdersPage } from '../../pages/MyOrdersPage';
import { dataVariables } from '../../test-data/dataVariables';
import { locators } from '../../test-data/locators';

test.setTimeout(90000);

console.log('E2E 9 - GSA');

test('E2E 9 - GSA', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');

  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);
  const orders = new MyOrdersPage(page);
  
  const auth = dataVariables.gsaMember;
  const categoryLink = locators.featured; // Change this to test different categories: activePlay, anotherCategory
  const subCategoryLink = locators.contractedItems; // Change this to test different subcategories: BalanceAndCoordination, anotherSubCategory
  const productNameLink = dataVariables.GSA;

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.signInFromHeader();
    await home.enterSignInCredentials(auth);
    await cart.emptyCart();
    await home.hoverMainNavLink(categoryLink);
    await home.selectCategoryLink(subCategoryLink);
    await category.selectProductNameLink(productNameLink);
    await product.addToCart();
    await product.clickCheckoutButton();
    await checkout.submitOrder('$33.58');
    await checkout.verifyThankYouPage('$33.58');
    await home.clickOrdersLink();
    await orders.clickOrderNumber('$33.58');
    await orders.verifyTotalAmount('$33.58');
    await home.signOutFromHeader();

    console.log('🎉 Test completed successfully');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    throw error;
  }
});