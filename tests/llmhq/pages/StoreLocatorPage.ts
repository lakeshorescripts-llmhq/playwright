import { Page, expect } from '@playwright/test';

export class StoreLocatorPage {
  constructor(private page: Page) {}

  async searchForStore(storeName: string) {
    console.log(`🔍 Searching for store: ${storeName}`);
    await this.page.getByTestId('store-search-input').fill(storeName);
    await this.page.getByTestId('store-search-button').click();
    await expect(this.page).toHaveURL(/stores\/locator/);
  } 

  async clickViewAllStoresLink(){
    const viewAllStoresLink = this.page.getByText('View All Stores');
    await expect(viewAllStoresLink).toBeVisible();
    await viewAllStoresLink.click();
  }

  async selectStore(storeName: string) {
    await this.page.getByRole('link', { name: storeName }).click();
    await this.page.getByRole('link', { name: 'Make Your Store' }).click();
    const selectedStore = this.page.getByRole('button', { name: new RegExp(storeName) }).nth(0);
    await expect(selectedStore).toBeVisible();
  }
    
}