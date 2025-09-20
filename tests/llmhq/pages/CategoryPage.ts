import { Page, expect } from '@playwright/test';
import { CategoryRole } from '../types/category';

export class CategoryPage {
  constructor(private page: Page) {}

  async selectSubCategory(subCategory: { role: CategoryRole, name: string }) {
    console.log(`📦 Selecting sub-category: ${subCategory.name}`);
    await this.page.waitForLoadState('domcontentloaded');
    const subCategoryLink = this.page.getByRole(subCategory.role, { name: subCategory.name });
    await expect(subCategoryLink).toBeVisible();
    await subCategoryLink.click();
  }

  async selectSortOption(sortOption: Record<string, string>) {
    console.log(`📦 Selecting sort option: ${sortOption.name}`);
    await this.page.waitForLoadState('domcontentloaded');
    const sortDropdown = this.page.locator('div').filter({ hasText: /^Best SellersPrice - LowPrice - HighTop RatedWhat's New$/ }).getByRole('combobox');
    await sortDropdown.selectOption(sortOption.name);
    await expect(this.page).toHaveURL(/sort-price-asc/);
  }
  
  async selectDynamicPriceFilter(filter: { name: string }) {
  console.log(`📦 Selecting dynamic price filter: ${filter.name}`);
  
  // Wait for the page to be ready
  await this.page.waitForLoadState('domcontentloaded');

  // Escape special characters for regex
  const escapedLabel = filter.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create a regex to match something like "Label (123)"
  const regex = new RegExp(`${escapedLabel}\\s*\\(\\d+\\)`, 'i');

  // Find the element by text using regex
  const filterOption = this.page.getByText(regex).first();

  // Ensure it's visible before clicking
  await expect(filterOption).toBeVisible();
  await filterOption.click();
}


  async selectProductNameLink(productName: Record<string, string> ) {
    console.log(`📦 Selecting product: ${productName.name}`);
    await this.page.waitForLoadState('domcontentloaded');
    // Find the product link by text and ensure it's a product link

    //const subCategoryLink = this.page.getByRole(subCategory.role, { name: subCategory.name });
    const product = this.page.getByRole('link', {name: productName.name});

    //const product = this.page.getByTestId('link').getByText('productName.name', { exact: false }).first();
    await expect(product).toBeVisible();
    await product.click();
    // Verify we landed on the correct product page
    const pdpName = this.page.getByRole('heading').getByText(productName.name, { exact: false }).first();
    await expect(pdpName).toBeVisible();
  }

  async mobileFilterLink(){
    console.log('📦 Clicking on mobile Filter button...');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('text=Filter')
    await this.page.waitForTimeout(1000); // Waits for 5 seconds
    await this.page.click('text=Filter', { timeout: 5000 }); // Click the Filter button
    //await expect(this.page.getByRole('button', { name: 'Clear All Filters' })).toBeVisible();
  }

  async mobileSelectNarrowByFilter(category: { role: CategoryRole, name: string }) {
    console.log(`📦 Selecting mobile category filter: ${category.name}`);
    await this.page.waitForLoadState('domcontentloaded');
    const categoryHeading = this.page.getByRole(category.role, { name: category.name });
    await expect(categoryHeading).toBeVisible();
    await categoryHeading.click();
  }

  async mobileSelectFilterOption(filterOption: { role: CategoryRole, name: string }) {
    console.log(`📦 Selecting mobile filter option: ${filterOption.name}`);
    await this.page.waitForLoadState('domcontentloaded');
    const subCategoryLocator = this.page.locator('span', {
      hasText: new RegExp(filterOption.name, 'i'),
    }).last();
    await expect(subCategoryLocator).toBeVisible();
    await subCategoryLocator.click();
    //const filterOptionLocator = this.page.getByRole(filterOption.role, { name: filterOption.name });
    //await expect(filterOptionLocator).toBeVisible();
    //await filterOptionLocator.click();
    await expect(this.page.getByRole('button', { name: 'Clear Category Filters' })).toBeVisible();
  }

  async mobileSelectViewResultsButton (){
  console.log('📦 Clicking on "View Results" link...');
  await this.page.waitForLoadState('domcontentloaded');
  const viewResultsLink = this.page.getByRole('link', { name: /View \d+ Results/ });
  await expect(viewResultsLink).toBeVisible();
  await viewResultsLink.click();
  }




async navigate() {
    await this.page.goto('/products/gift-cards/N/3910126112/');
  }

  async isPageLoaded() {
  return this.page.getByRole('heading', { name: /Gift Cards/i }).isVisible();
  }



  async clickCheckBalance() {
    await this.page.getByTestId('handle-show').click();
  }


}