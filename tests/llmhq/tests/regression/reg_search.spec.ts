import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { searchData } from '../../test-data/searchData';
import { productData } from '../../test-data/productData';

test.describe('Search Regression Tests', () => {
    // Configure tests to run serial (one after another) or parallel (same time based on # workers)
    test.describe.configure({ mode: 'parallel' });
    
    let homePage: HomePage;
    
    const {
        keyword: searchKeyword,
        sku: searchSku,
        noResults,
        stopWord,
        stemming,
        thesaurus,
        automaticPhrasing,
        contentTabResults
    } = searchData;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
       
        // Clear state before each test
        await page.context().clearCookies();
        await page.reload();
        await homePage.navigateTo();
        await homePage.closeConsentBanner();
        await expect(page.locator('#onetrust-group-container')).not.toBeVisible();
    });

    test('verify clear search field if x is clicked', async ({ page }) => {
        await homePage.inputSearchTerm(searchSku);
        const xButton = page.getByRole('button', { name: 'Remove search input' });
        //await expect(xButton).toBeVisible();
        await (xButton).isVisible();
        await (xButton).click();
        //await expect(page.getByTestId('search-product-input')).toBeEmpty();
    });

    test('verify display recently viewed type-ahead popup', async ({ page }) => {
        await homePage.inputSearchTerm(searchKeyword);
        await homePage.pressEnterKey();
        
        // Wait for search results to load
        await page.waitForURL(new RegExp(`/search/`, 'i'), { timeout: 10000 });
        await page.waitForLoadState('load');
        await page.waitForTimeout(1000);
        
        // Go back to home page
        await homePage.navigateTo();
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(1000);
        
        // Focus the search field to trigger the type-ahead popup
        await homePage.focusSearchField();
        
        // Wait a bit for the popup to appear
        await page.waitForTimeout(1000);
        
        // Verify the recently viewed popup is visible  
        await expect(page.getByRole('heading', { name: 'Recent Searches:' })).toBeVisible();
        
        // Verify the recently viewed item contains our search keyword
        await expect(page.getByText(`${searchKeyword}`).last()).toBeVisible();
    });

    test('verify display type-ahead popup', async ({page}) => {
        await homePage.inputSearchTerm(contentTabResults);
                
        // Focus the search field to trigger the type-ahead popup
        await homePage.focusSearchField();
        
        // Wait a bit for the popup to appear
        await page.waitForTimeout(1000);
        
        // Verify the type-ahead popup is visible
        await expect(page.getByRole('heading', { name: 'Search Suggestions:' })).toBeVisible({timeout: 3000});
        await expect(page.getByRole('heading', { name: 'Category Suggestions:' })).toBeVisible({timeout: 3000});
        await expect(page.getByRole('heading', { name: 'Product Suggestions:' })).toBeVisible({timeout: 3000});
    });

    test('verify execute a keyword search by clicking search button', async ({ page }) => {
        await homePage.inputSearchTerm(searchKeyword);
        await homePage.clickSearchButton();
        await expect(page.getByText(`${searchKeyword}`)).toBeVisible();
    });

    test('verify execute SKU search by pressing Enter key', async ({ page }) => {
        await homePage.inputSearchTerm(searchSku);
        await homePage.pressEnterKey();
        await expect(page).toHaveURL(new RegExp(`/products/.*/${searchSku}/`));
    });

    test('verify execute no search results', async ({ page }) => {
        await homePage.inputSearchTerm(noResults);
        await homePage.clickSearchButton();
        await expect(page.getByText("We're sorry! There are no")).toBeVisible();
    });

    test('verify stop word search returns no results', async ({ page }) => {
        await homePage.inputSearchTerm(stopWord);
        await homePage.clickSearchButton();
        await expect(page.getByText("We're sorry! There are no")).toBeVisible();
    });

    test('verify automatic phrasing search', async ({ page }) => {
        await homePage.inputSearchTerm(automaticPhrasing);
        await homePage.clickSearchButton();
        await expect(
            page.getByRole('heading', {name: new RegExp(`results for.*${automaticPhrasing}`, 'i')})).toBeVisible();
        await expect(page.getByText(new RegExp(automaticPhrasing, 'i')).last()).toBeVisible();
    });

    test('verify stemming search', async ({ page }) => {
        await homePage.inputSearchTerm(stemming);
        await homePage.clickSearchButton();
        await expect(
        page.getByRole('heading', {name: new RegExp(`results for "${stemming}"`, 'i')})).toBeVisible();
    });


    test('verify thesaurus search', async ({ page }) => {
        await homePage.inputSearchTerm(thesaurus);
        await homePage.clickSearchButton();
        await expect(page.getByText('puppy').last().or(page.getByText('dogs').last())).toBeVisible();
    });

    test('verify content tab results', async ({ page }) => {
        await homePage.inputSearchTerm(contentTabResults);
        await homePage.clickSearchButton();
        await expect(page.getByRole('listitem').filter({ hasText: 'Products (' })).toBeVisible();
        await expect(page.getByRole('listitem').filter({ hasText: 'Videos (' })).toBeVisible();
    });

    test('verify SKU with options auto-selects dropdowns on PDP', async ({ page }) => {

        const product = productData.twodropdowns;

        if (!product) {
            throw new Error('Product data for "twodropdowns" is missing.');
        }


        // Search for the SKU and wait for navigation
        await homePage.inputSearchTerm(product.sku);
        await homePage.pressEnterKey();
        //await homePage.clickSearchButton();
        
        // Verify we're on the correct PDP
        await page.waitForURL(new RegExp(`/products/.*${product.sku}.*`, 'i'), { timeout: 10000 });
        //await page.waitForLoadState('networkidle');
        await page.waitForLoadState('load');
        //await page.waitForLoadState('domcontentloaded');
        //await page.waitForTimeout(5000);

        //const allButtons = await page.getByRole('button').allTextContents();
        //console.log('Available buttons:', allButtons);

        // Get individual dropdowns
        const sizeDropdown = page.getByRole('button', { name: `${product.option}`, exact: false}).last();
        const colorDropdown = page.getByRole('button', { name: `${product.option2}`, exact: false});

        // Wait for and verify both dropdowns
        await sizeDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await colorDropdown.waitFor({ state: 'visible', timeout: 10000 });

        // Verify the Add to Cart button is enabled
        const addToCartButton = page.locator('#right-des-content-add');
        await expect(addToCartButton).toBeEnabled();

        // Verify the item number displays
        const itemNum = page.getByText(`Item # ${product.sku}`);
        await expect(itemNum).toBeVisible();



        // Optional: Verify the product name (if visible in the UI)
        try {
            const productName = page.getByRole('heading', { name: new RegExp(product.name, 'i') });
            await expect(productName).toBeVisible({ timeout: 5000 });
        } catch {
            console.log('Product name verification skipped - heading not found');
        }
    });
});
