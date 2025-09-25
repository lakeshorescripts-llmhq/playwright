import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';
import { locators } from '../../test-data/locators';

test.setTimeout(60000);

console.log('E2E 8 - CREATE ACCOUNT - AVS');

test('E2E 8 - CREATE ACCOUNT - AVS', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const mainNavCategory = locators.sale; // Change this to test different main navigation categories: shopAll, shopByGrade, anotherCategory
  const categoryLink = locators.allSaleItems; // Change this to test different categories: activePlay, anotherCategory
  const sortOption = dataVariables.sortByPriceHighToLow; // Change this to test different sort options: sortByPriceLowToHigh, sortByPriceHighToLow
  const productNameLink = dataVariables.TEST051; // Change this to test different product names: productNameLink
  const creditCard = dataVariables.discover; // Change this to test different cards: visa, mastercard, amex, discover
  const deliveryAdd = dataVariables.avsAdd; // Change this to test different addresses: contiguous, noncontiguous

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.createAccount();
    await home.hoverMainNavLink(mainNavCategory);
    await home.selectCategoryLink(categoryLink);
    await category.selectSortOption(sortOption);
    await category.selectProductNameLink(productNameLink);
    await product.addToCart();
    await product.viewCart();
    await cart.enterQty(productNameLink);
    await cart.checkout();
    await checkout.fillDeliveryAddress(deliveryAdd);
    await checkout.avsModal();
    await checkout.fillCreditCardPaymentInfo(creditCard);
    await checkout.submitOrder('$70901.92');
    await checkout.verifyThankYouPage('$70,901.92');
    await home.signOutFromHeader();

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});

