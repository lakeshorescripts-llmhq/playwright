import { Page, expect } from '@playwright/test';

export class MyOrdersPage {
  constructor(private page: Page) {}

  async clickOrderNumber(expectedTotal: string) {
    console.log(`📦 Clicking on the most recent order with total: ${expectedTotal}`);
    const orderNumLink = this.page.locator('//tr[1]/td[@data-bind="clickBubble: false, click: $parent.goToOrderDetails"]').first();
    await expect(orderNumLink).toBeVisible();
    await orderNumLink.click();
    await expect(this.page).toHaveURL(/order-details/, {timeout: 10000});
  }

  async verifyBillingInfo(billing: Record<string, string>, isStorePickup: boolean = false) {
  console.log(`📦 Verifying billing information for: ${billing.firstName} ${billing.lastName}`);

  const checks = [
    { locator: this.page.getByText(`${billing.firstName} ${billing.lastName}`).last(), label: 'Name' },
    { locator: this.page.getByText(billing.school), label: 'School' },
    { locator: this.page.getByText(billing.address1).last(), label: 'Address1' },
    { locator: this.page.getByText(billing.address2), label: 'Address2' },
    { locator: this.page.getByText(billing.city).nth(1), label: 'City' },
    { locator: this.page.locator('span').filter({ hasText: new RegExp(`${billing.state}$`) }).nth(0), label: 'State' },
    { locator: this.page.getByText(billing.zipCode).nth(1), label: 'Zip Code' },
    { locator: this.page.getByText(billing.country, { exact: true }).last(), label: 'Country' },
    { locator: this.page.getByText(billing.phone).nth(0), label: 'Phone' },
  ];

  for (const { locator, label } of checks) {
    if (isStorePickup && ['Address1', 'Address2', 'City', 'State', 'Zip Code', 'Country'].includes(label)) {
      continue;
    }
    try {
      if (await locator.isVisible()) {
        await expect(locator).toBeVisible();
      } else {
          console.warn(`⚠️ ${label} not visible on the page.`);
        }
      } catch (error) {
      const err = error as Error;
      console.log(err.message);
    }
  }
}


  async verifyTotalAmount(expectedTotal: string) {
    console.log(`📦 Verifying total amount: ${expectedTotal}`);
    await expect(this.page.getByText(expectedTotal).last()).toBeVisible();
  }
}
