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


  /*
  test('Items Per Page', async () => {
    // validate select each option from the Items per page dropdown displays the number of page results in the selected option
  });

  test('Pagination', async () => {
    // validate pagination functionality at the top and bottom of the page functions properly
  });

  test('Narrow By Availability', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Category', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Product Use', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Grade', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Age', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Price', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Color or Pattern', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Celebration or Season', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Narrow By Collection', async () => {
    // valdate selecting an option under this filter updates the page results accordingly
  });

  test('Regular Price', async () => {
    // validate the product displays accurate price in black color text (ie: "$10.00")
  });

  test('Regular Price Range', async () => {
    // validate the product displays accurate price range in black color text (ie: $1.99 - $5.99)
  });

  test('Sale Price', async () => {
    // validate the product displays accurate sale price in red color text and the regular price displays below the sale price in black text (ie: "reg. $19.99")
  });

  test('Sale Price Price', async () => {
    // validate the product displays accurate sale price raneg in red color text and the regular price range displays  below the sale price range in black text (ie: "reg. $19.99 - $29.99")
  });

  test('Store Pickup Only Items', async () => {
    // validate the store pickup only item displays "Store Pickup Only" and "FREE Store Pickup"
  });

  test('Links in List View', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Review Count Display', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Links in List View', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Store Pickup Help Icon Under Narrow By Availabiltiy', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('If No Products are Available with the Selected Store', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Links in List View', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Doorbuster Products', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('GSA Products', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Presell Products', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Exclusive Products', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Disruptor Tiles', async () => {
    // validate links displays for products in List View are functioning properly (ie: LC763)
  });

  test('Disruptor Banner', async () => {
    // validate banner display properly with 1-3 buttons and buttons are functional
  });


*/






});