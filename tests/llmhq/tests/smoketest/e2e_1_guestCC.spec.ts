import { test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage'; // Example alternative path if needed
import { CategoryPage } from '../../pages/CategoryPage'; // Example alternative path if needed
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { dataVariables } from '../../test-data/dataVariables';
import { locators } from '../../test-data/locators';

test.setTimeout(60000);

console.log('E2E 1 - GUEST - CREDIT CARD - BILLING LOQATE');

test('E2E 1 - GUEST - CREDIT CARD - BILLING LOQATE', async ({ page }) => {
  console.log('✅ Test started: Complete checkout flow');
  const home = new HomePage(page);
  const category = new CategoryPage(page);
  const product = new ProductPage(page);
  const cart = new CartPage(page);
  const checkout = new CheckoutPage(page);

  const mainNavCategory = locators.shopAll; // Change this to test different main navigation categories: shopAll, shopByGrade, anotherCategory
  const categoryLink = locators.activePlay; // Change this to test different categories: activePlay, anotherCategory
  const subCategoryLink = locators.BalanceAndCoordination; // Change this to test different subcategories: BalanceAndCoordination, anotherSubCategory
  const priceFilter = locators.Under10; // Change this to test different price filters: Under10, TwentyToThirty
  const productNameLink = dataVariables.CW527; // Change this to test different product names: productNameLink
  const creditCard = dataVariables.amex; // Change this to test different cards: visa, mastercard, amex, discover
  const emailContact = dataVariables.emailContact1; // Change this to test different emails: emailContact1, emailContact2
  const deliveryAdd = dataVariables.contiguous; // Change this to test different addresses: contiguous, noncontiguous
  const shippingOption = dataVariables.standard; // Change this to test different shipping options: standard, secondDayAir, nextDayAir, priority
  const billingAdd = dataVariables.loqate; // Change this to test different billing addresses: contiguous, noncontiguous, loqate, noSalesTax

  try {
    await home.navigateHP();
    await home.closeConsentBanner();
    await home.hoverMainNavLink(mainNavCategory);
    await home.selectCategoryLink(categoryLink);
    await category.selectSubCategory(subCategoryLink);
    await category.selectDynamicPriceFilter(priceFilter);
    await category.selectProductNameLink(productNameLink);
    await product.selectProductOption(productNameLink);
    await product.addToCart();
    await product.viewCart();
    await cart.checkout();
    await checkout.fillEmailAddress(emailContact);
    await checkout.fillDeliveryAddress(deliveryAdd);
    await checkout.selectShippingOption(shippingOption);
    await checkout.fillCreditCardPaymentInfo(creditCard);
    await checkout.uncheckUseDeliveryAddressAsBilling();
    await checkout.fillBillingAddressLoqate(billingAdd);
    await checkout.submitOrder('$31.12');
    await checkout.verifyThankYouPage('$31.12');

    console.log('🎉 TEST COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ TEST FAILED WITH ERROR!', error);
    throw error;
  }
});

