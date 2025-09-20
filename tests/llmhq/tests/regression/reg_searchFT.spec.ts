import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { searchData } from '../../test-data/searchData';

test.describe('Search Regression Tests', () => {
    // Configure tests to run serially (one after another) or parallel (same time based on # workers)
    test.describe.configure({ mode: 'parallel' });
    
    let homePage: HomePage;
   
    const {
        keyword: searchKeyword,
        sku: searchSku,
        noResults,
    } = searchData;



    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        


        await homePage.navigateToFurnitureTab();
        await homePage.closeConsentBanner();
        await expect(page.locator('#onetrust-group-container')).not.toBeVisible();
        await homePage.clickSearchButtonFT();
    });

    test('verify clicking x dismisses the search popup', async ({ page }) => {
        const searchPanelExpanded = page.locator('#search-panel[aria-expanded="true"]');
        const searchPanelCollapsed = page.locator('#search-panel[aria-expanded="false"]');
        const xButton = page.getByRole('banner').locator('#search-panel span').nth(2);

        
        await expect(searchPanelExpanded).toBeVisible();
        await xButton.click();
        //await page.waitForTimeout(5000);
        await expect(searchPanelCollapsed).toBeVisible();
    });

    test('should display recently viewed type-ahead popup', async ({page}) => {
        await homePage.inputSearchTerm(searchKeyword);
        await homePage.pressEnterKey();
        
        // Wait for search results to load
        await page.waitForLoadState('domcontentloaded');
        
        // Go back to home page
        await homePage.navigateTo();
        
        // Focus the search field to trigger the type-ahead popup
        await homePage.focusSearchField();
        
        // Wait a bit for the popup to appear
        await page.waitForTimeout(1000);
        
        // Verify the recently viewed popup is visible
        await expect(page.getByRole('heading', { name: 'Recent Searches:' })).toBeVisible();
        
        // Verify the recently viewed item contains our search keyword
        //await expect(page.getByText(new RegExp(`.*/${searchKeyword}/`))).toBeVisible();
    });

    test('should display type-ahead popup', async ({page}) => {
        await homePage.inputSearchTerm(searchKeyword);
                
        // Focus the search field to trigger the type-ahead popup
        await homePage.focusSearchField();

        await page.getByRole('textbox', { name: 'Search:' }).click();

        // Wait a bit for the popup to appear
        await page.waitForTimeout(1000);
                        
        // Verify the type-ahead popup is visible
        //await expect(page.getByRole('heading', { name: 'Search Suggestions:' })).toBeVisible({timeout: 3000});
        await expect(page.getByText('Category Suggestions:')).toBeVisible({timeout: 3000});
        await expect(page.getByText('Product Suggestions:')).toBeVisible({timeout: 3000});
    });

    test('should execute a keyword search by clicking search button', async ({ page }) => {
        await homePage.inputSearchTerm(searchKeyword);
        await homePage.clickSearchButton();
        await expect(page.getByText(`${searchKeyword}`)).toBeVisible();
    });

    test('should execute SKU search by pressing Enter key', async ({ page }) => {
        await homePage.inputSearchTerm(searchSku);
        await homePage.pressEnterKey();
        await expect(page).toHaveURL(new RegExp(`.*/${searchSku}/`));
    });

    test('should execute no search results', async ({ page }) => {
        await homePage.inputSearchTerm(noResults);
        await homePage.clickSearchButton();
        await expect(page).toHaveURL(`/furniture/search/zero-results?Ntt=${noResults.toLowerCase()}`);
    });

    
});