import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CategoryPage } from '../../pages/CategoryPage';
import { locators } from '../../test-data/locators';
import { dataVariables } from '../../test-data/dataVariables';




test.describe('PLP Regression Tests', () => {
    // Configure tests to run parallel (at the same time based on # of workers set)
    test.describe.configure({ mode: 'parallel' });
    
    const filterOption = locators.BackToSchool;
    const sortOption = dataVariables.sortByPriceHighToLow;

    let homePage: HomePage;
    let categoryPage: CategoryPage;
   
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        categoryPage = new CategoryPage(page);
   
        // Clear state before each test
        await page.context().clearCookies();
        await page.reload();
        await homePage.navigateTo();
        await homePage.closeConsentBanner();
        await expect(page.locator('#onetrust-group-container')).not.toBeVisible();
        await page.waitForLoadState('domcontentloaded');
    });

    
    test('Narrow by Availability', async ({page}) => {
      await page.goto('/products/classroom-furniture/tables-desks/N/1203103665/');
      await page.getByRole('listitem').filter({ hasText: 'Store Pickup (' }).locator('#checkbox-').click();
      await expect(page.getByText('FREE Store Pickup').first()).toBeVisible();
   });


  test('Page should load correctly', async ({page}) => {
    await homePage.clickGiftCards();
    await expect(page.getByRole('link', { name: 'Here’s to a Bright School' })).toBeVisible();
  });

  test('Filter by Card Type', async ({page}) => {
    await homePage.clickGiftCards();
    const egcFilter = page.getByRole('listitem').filter({ hasText: 'E-Gift Card (' }).locator('#checkbox-');
    const egcHeader = page.getByText('E-Gift Cards', { exact: true });
    const gcHeader = page.getByText('Physical Gift Cards');
    await expect(egcHeader).toBeVisible();
    await expect(gcHeader).toBeVisible();
    await (egcFilter).click();
    await expect(egcHeader).toBeVisible();
    await expect(gcHeader).not.toBeVisible();
  });

  test('Filter by Occasion', async ({page}) => {
    await homePage.clickGiftCards();
    await categoryPage.selectDynamicPriceFilter(filterOption);
    const itemCheck = page.getByRole('link', { name: 'Confetti Happy Birthday To' });
    await expect(itemCheck).not.toBeVisible();
  });

  test('Click Check Your Balance', async ({page}) => {
    await homePage.clickGiftCards();
    await categoryPage.clickCheckBalance();
    await expect(page.getByRole('heading', { name: 'Check Balance' })).toBeVisible();
  });

  test('Click Product Name', async ({page}) => {
    await homePage.clickGiftCards();
    await page.getByRole('link', { name: 'Here’s to a Bright School' }).click();
    await expect(page.getByRole('heading', { name: 'Here’s to a Bright School' })).toBeVisible(); 
  });

  test('Click Product Image', async ({page}) => {
    await homePage.clickGiftCards();
    await page.locator('.product-card_image-wrapper__4FLO0 > a').first().click();
    await expect(page.getByRole('heading', { name: 'Here’s to a Bright School' })).toBeVisible();
  });

  test('Click Top', async ({page}) => {
    await homePage.clickGiftCards();
    const topButton = page.getByTestId('back-to-top-button').locator('i');
    await (topButton).scrollIntoViewIfNeeded();
    await (topButton).click();
    await page.waitForTimeout(2000);
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBe(0);
  });



  test('Breadcrumbs', async ({ page }) => {
    // validate navigating to a category and selecting a subcategory displays the correct breadcrumb trail and verify the links are valid
    // Navigate to the Active Play category page
    await page.goto('/sale/N/706611647+1170192422+2463492293/');

    // Wait for breadcrumb container
    const breadcrumbSelector = '.breadcrumb'; // Adjust if needed
    await page.waitForSelector(breadcrumbSelector);

    // Locate breadcrumb links
    const breadcrumbLinks = page.locator(`${breadcrumbSelector} a`);
    const breadcrumbCount = await breadcrumbLinks.count();

    // Assert expected breadcrumb link count (e.g., Home > Products > Sale > Classroom Decorations)
    expect(breadcrumbCount).toBeGreaterThanOrEqual(2);

    // Check specific breadcrumb text
    const expectedBreadcrumbs = ['Home', 'Products', 'Sale', 'Classroom Decorations']; //Posters & Charts is not a link in breadcrumb
    for (let i = 0; i < expectedBreadcrumbs.length; i++) {
      const text = await breadcrumbLinks.nth(i).innerText();
      expect(text.trim()).toContain(expectedBreadcrumbs[i]);
    }

    // Validate each breadcrumb link is visible and has a valid href
    for (let i = 0; i < breadcrumbCount; i++) {
      const link = breadcrumbLinks.nth(i);
      expect(await link.isVisible()).toBeTruthy();

      const href = await link.getAttribute('href');
      expect(href).toMatch(/^https?:\/\/|^\//); // Accepts both absolute and relative URLs


      // Optionally test navigation
      await Promise.all([
        page.waitForNavigation(),
        link.click()
      ]);
      expect(page.url()).toContain(href);
      await page.goBack();
    }
  });

    test('List View', async ({ page }) => {
    // validate selecting list view displays the page results in a list prespective displaying product description and item number
    await homePage.hoverShopAll();
    await homePage.selectCategoryLink(locators.activePlay);
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('list-view-button').click();
    await page.pause();
    await expect(page.getByText(/Item # /).first()).toBeVisible();
  });

  
  test('Grid View', async ({page}) => {
    // validate selecting grid view displays the page results in a grid view prespective not displaying product description and item number
    await homePage.hoverShopAll();
    await homePage.selectCategoryLink(locators.activePlay);
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId('grid-view-button').click();
    await page.pause();
    await expect(page.getByText(/Item # /).first()).not.toBeVisible();
  });

  
  test('Sort', async ({ page }) => {
    await homePage.hoverShopAll();
    await homePage.selectCategoryLink(locators.activePlay);
    await page.waitForLoadState('domcontentloaded');
    await categoryPage.selectSortOption(sortOption);
  });

  test('Items Per Page', async ({ page }) => {
    test.setTimeout(90000);

    // Navigate to category page and handle banner
    await homePage.hoverShopAll();
    await homePage.selectCategoryLink(locators.activePlay);

    // Wait for initial page load
    // await page.waitForLoadState('domcontentloaded');
    // await page.waitForLoadState('networkidle');

    // Find and verify product cards
    const productSelector = '[class*="product-card"] img[alt]';
    await page.waitForSelector(productSelector, { state: 'visible' });

    // Find items per page dropdown
    const itemsPerPageDropdown = page.locator('select').filter({ hasText: 'Per Page' }).first();
    await expect(itemsPerPageDropdown).toBeVisible();

    // Test each page size option
    for (const pageSize of ['24', '48', '96']) {
      // Set up navigation promise
      const navigationPromise = page.waitForResponse(
        res => res.url().includes('/products/active-play/') && res.status() === 200
      );

      // Select new page size and wait for update
      await itemsPerPageDropdown.selectOption({ label: `${pageSize} Per Page` });
      await navigationPromise;
      await page.waitForLoadState('domcontentloaded');

      // Scroll to ensure all products load
      await page.evaluate(() => window.scrollTo(0, 0));

      // Wait for and count visible products
      await page.waitForSelector(productSelector, { state: 'visible' });
      const visibleProducts = await page.locator(productSelector).all();

      // Verify selected option
      const selectedText = await itemsPerPageDropdown.inputValue();
      expect(selectedText).toBe(`${pageSize} Per Page`);

      // Verify URL pattern
      expect(page.url()).toContain(`/num-${pageSize}/`);

      // Verify product count
      expect(visibleProducts.length).toBeGreaterThan(0);
      expect(visibleProducts.length).toBeLessThanOrEqual(Number(pageSize));
    }
  });

});