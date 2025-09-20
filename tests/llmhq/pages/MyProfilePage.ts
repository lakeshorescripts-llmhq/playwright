import { Page, expect } from '@playwright/test';

export class MyProfilePage {
  constructor(private page: Page) {}

  async deleteAccount() {
    console.log('🧹 Deleting the test account...');

    // You cannot use test.use() here. Instead, set storageState when launching the browser or creating the context.
    // This should be handled in your test setup, not inside this method.

    await this.page.goto('/my-account/');
    await this.page.getByRole('link', { name: 'Profile' }).click();
    await this.page.getByRole('link', { name: 'Delete My Account' }).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();

    await expect(this.page.getByRole('heading', { name: 'Your Account Has Been Deleted' })).toBeVisible();
    await this.page.getByRole('button', { name: 'OK' }).click();
    await expect(this.page.getByRole('banner')).toContainText('Account');

    console.log('✅ Test account deleted.');
  }
}
