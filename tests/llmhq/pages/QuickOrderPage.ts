import { Page, expect } from '@playwright/test';

interface QuickOrderInfo {
  sku: string | number;
  qty: string | number;
}


export class QuickOrderPage {
  constructor(private page: Page) {}

  async enterQuickOrderInfo(quickOrderInfo: QuickOrderInfo) {
    console.log('🛒 Entering Quick Order Info');
    const rowIndex = 0;
    
    const sku = String(quickOrderInfo['sku']);
    const quantity = String(quickOrderInfo['qty']);
  
    const row = this.page.getByRole('row', { name: /Remove/ }).nth(rowIndex);
    await row.getByLabel('item-sku').fill(sku);

    const qtyField = row.getByRole('cell', { name: sku }).getByLabel('item-qty');
    await qtyField.click();
    await qtyField.fill(quantity);
    await this.page.waitForLoadState('load');

    await expect(qtyField).toHaveValue(quantity);
  }

  async clickAddToCartButton() {
    console.log('🛒 Clicking Add to Cart Button');
    await this.page.waitForLoadState('domcontentloaded');
    const addToCartButton = this.page.getByRole('button', { name: 'Add to Cart' });
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();
    await expect(this.page).toHaveURL(/shopping-cart/);
  }
}
