import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Declare the types of your fixtures
type TestFixtures = {
  homePage: HomePage;
  categoryPage: CategoryPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Extend the base test with your fixtures
export const test = base.extend<TestFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  categoryPage: async ({ page }, use) => {
    const categoryPage = new CategoryPage(page);
    await use(categoryPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

// Common setup steps
export async function setupTest(page: any) {
  const homePage = new HomePage(page);
  await page.context().clearCookies();
  await page.reload();
  await homePage.navigateTo();
  await homePage.closeConsentBanner();
}

export { expect } from '@playwright/test';