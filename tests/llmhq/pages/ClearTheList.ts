import { Page, expect } from '@playwright/test';

export class ClearTheList {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  
  async navigateTo() {
    await this.page.goto('/clear-the-list/', { waitUntil: 'load' });
  }

  async createAListButton() {
    const createAListButton = this.page.getByText('Create a List', { exact: true });
    await createAListButton.isEnabled();
    await createAListButton.click();
  }

  async enterCreateCTLInfo() {
    await this.page.waitForTimeout(1000); // slight buffer for UI update
    await expect(this.page.locator('#first-name')).toHaveValue('playwright');
    await expect(this.page.locator('#last-name')).toHaveValue('user');
    await expect(this.page.locator('#country-list')).toHaveValue('US');
    await expect(this.page.locator('input[name="address1"]').nth(0)).toHaveValue('2695 E Dominguez St');
    await expect(this.page.locator('input[name="address2"]').nth(0)).toHaveValue('testAddress2');
    await expect(this.page.locator('input[name="city"]').nth(0)).toHaveValue('Carson');
    await expect(this.page.locator('#state-new')).toHaveValue('CA');
    await expect(this.page.locator('input[name="zip"]').nth(0)).toHaveValue('90895-1000');
    await this.page.getByRole('button', { name: 'Create List' }).click();
    await expect(this.page.getByText('Please enter a list name.').first()).toBeVisible();
    await expect(this.page.getByText('Please enter Zip/Postal Code.')).toBeVisible();
    const timestamp = new Date().toISOString(); // or use any other format you prefer
    const ctlName = `tempCTL-${timestamp}`;
    await this.page.locator('#ctl-name').getByPlaceholder(' ').fill(ctlName);
    await this.page.locator('#school-name').fill('tempSchool');
    await expect(this.page.locator('#school-zip').nth(0)).toBeVisible();
    await this.page.locator('#school-zip').nth(0).fill('12345');
    await this.page.getByRole('textbox', { name: 'I\'ve created a shopping list' }).fill('tempCTL Message');
    await this.page.getByRole('button', { name: 'Create List' }).click();
  }

  async startYourList() {
    const startYourListButton = this.page.getByText('Start Your List', { exact: false });
    await expect(startYourListButton).toBeVisible({ timeout: 5000 });
    await expect(startYourListButton).toBeEnabled();
    await startYourListButton.click();
  }

  async FindClearTheList(
    firstName = 'play',
    lastName = 'use',
    school = 'tempSchool',
    zip = '12345'
    ) {
      console.log('🔍 Navigating to Find a List...');
      const findListLink = this.page.getByRole('link', { name: 'Find a List' });
    await expect(findListLink).toBeVisible({ timeout: 5000 });
    await findListLink.click();
    console.log('📝 Filling out search form...');
    const firstNameField = this.page.getByRole('textbox', { name: 'First Name' });
    const lastNameField = this.page.getByRole('textbox', { name: 'Last Name' });
    const schoolField = this.page.getByRole('textbox', { name: 'School/Institution' });
    const zipField = this.page.getByRole('textbox', { name: 'Zip Code' });
    const searchButton = this.page.getByRole('button', { name: 'Search' });
    await expect(firstNameField).toBeVisible({ timeout: 5000 });
    await firstNameField.fill(firstName);
    await lastNameField.fill(lastName);
    await schoolField.fill(school);
    await zipField.fill(zip);
    await expect(searchButton).toBeEnabled({ timeout: 5000 });
    await searchButton.click();
    console.log('✅ Search submitted.');
  }

  async deleteList() {
    await this.page.goto('/my-shoppinglist-page/');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); // buffer for UI update
    const editButtonLocator = this.page.getByRole('button', { name: ' Edit' });
    while (await editButtonLocator.count() > 0) {
      console.log('🗑️ Found a list to delete...');
      // Click the first "Edit" button
      await editButtonLocator.first().click();
      // Click "Delete List" link
      const deleteLink = this.page.locator('a', { hasText: 'Delete List' });
      await expect(deleteLink).toBeVisible({ timeout: 5000 });
      await deleteLink.click();
      // Confirm deletion
      const confirmDeleteButton = this.page.getByRole('button', { name: 'Delete List' });
      await expect(confirmDeleteButton).toBeEnabled();
      await confirmDeleteButton.click();
      // Wait for UI to settle before checking again
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);
    }
  console.log('✅ All shopping lists have been deleted.');
  }


}
