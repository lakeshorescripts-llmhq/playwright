import { Page, expect } from '@playwright/test';


export class CheckoutPage {
  constructor(private page: Page) {}

  async waitForCheckoutPage() {
    console.log('⏳ Waiting for checkout page to load');
    await this.page.waitForURL(/checkout-page/);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async handleAddressVerification() {
    console.log('🏠 Handling address verification');
    const addressVerification = this.page.getByRole('heading', { name: 'Address Verification' });
    await expect(addressVerification).toBeVisible();

    const suggestedAddress = this.page.getByRole('heading', { name: 'Suggested Address' });
    await expect(suggestedAddress).toBeVisible();
    await suggestedAddress.click();

    const selectAddressButton = this.page.getByRole('button', { name: 'Select Address' });
    await expect(selectAddressButton).toBeVisible();
    await selectAddressButton.click();
    await expect(addressVerification).not.toBeVisible();
  }

  

  async verifyOrderCompletion() {
    console.log('🎉 Verifying order completion');
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('Order Total:')).toBeVisible();
  }

  async fillEmailAddress(emailContact: Record<string, string>) {
    console.log('✉️ Filling email address');
    await expect(this.page.getByTestId('contactEmail')).toBeVisible();
    await this.page.getByTestId('contactEmail').fill(emailContact.email);
  }

  async signIn(emailAcct: Record<string, string>) {
    console.log('🔑 Signing in from checkout');
    await this.page.getByTestId('contactEmail').fill(emailAcct.email);
    await expect(this.page.getByRole('button', { name: 'Check Out as Guest' })).toBeVisible({ timeout: 5000 });
    await expect(this.page.getByTestId('coContactPwd')).toBeVisible();
    await this.page.getByTestId('coContactPwd').fill(emailAcct.password);
    await this.page.getByRole('button', { name: 'Log In' }).click();
    await expect(this.page.locator('section').filter({ hasText: emailAcct.email }).getByRole('button')).toBeVisible();
    await this.page.locator('section').filter({ hasText: emailAcct.email }).getByRole('button').click();
    await expect(this.page.getByRole('link', { name: 'Log out' })).toBeVisible();
  }

  async fillStorePickupInfo(pickupInfo: Record<string, string>) {
    console.log('🏪 Filling store pickup information');
    const storePickupArrow = this.page.locator('#shipping-section').getByRole('button', { name: 'down-arrow' });
    await expect(storePickupArrow).toBeVisible({ timeout: 30000 });
    await storePickupArrow.click();

    await expect(this.page.getByRole('heading', { name: 'Store Pickup' })).toBeVisible();
    await this.page.getByRole('checkbox', { name: 'Text me notifications' }).check();
    await this.page.getByTestId('phoneNumber').fill(pickupInfo.phone);
    await this.page.getByRole('checkbox', { name: 'Add an additional pickup' }).check();
    await expect(this.page.getByTestId('firstName')).toBeVisible();
    await this.page.getByTestId('firstName').fill(pickupInfo.firstName);
    await this.page.getByTestId('lastName').fill(pickupInfo.lastName);
    await this.page.getByTestId('email').fill(pickupInfo.email);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }


  async fillDeliveryAddress(deliveryAdd: Record<string, string>) {
    console.log('📬 Filling delivery address');
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(deliveryAdd.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(deliveryAdd.lastName);
    //await this.page.getByRole('textbox', { name: 'School/Institution (optional)' }).fill(deliveryAdd.school);
    //await this.page.getByRole('textbox', { name: 'Attention (optional)' }).fill(deliveryAdd.attention);
    await this.page.getByRole('textbox', { name: 'Address 1' }).fill(deliveryAdd.address1);
    //await this.page.getByRole('textbox', { name: 'Address 2 (optional)' }).fill(deliveryAdd.address2);
    await this.page.getByRole('textbox', { name: 'City' }).fill(deliveryAdd.city);
    await this.page.locator('select[name="state"]').selectOption(deliveryAdd.state);
    await this.page.getByRole('textbox', { name: 'Zip' }).fill(deliveryAdd.zip);
    await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(deliveryAdd.phone);
    await this.page.getByRole('button', { name: 'Continue' }).click({ timeout: 60000 });
    //await expect(this.page.getByRole('button', { name: 'down-arrow' }).nth(0)).toBeVisible({ timeout: 5000 });
  }

  async fillDeliveryAddressLoqate(deliveryAdd: Record<string, string>) {
    console.log('📬 Filling delivery address with Loqate');
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(deliveryAdd.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(deliveryAdd.lastName);
    await this.page.getByRole('textbox', { name: 'School/Institution (optional)' }).fill(deliveryAdd.school);
    await this.page.getByRole('textbox', { name: 'Attention (optional)' }).fill(deliveryAdd.attention);
    await this.page.getByRole('textbox', { name: 'Address 1' }).click();
    await this.page.keyboard.type(deliveryAdd.address1, { delay: 100 });
    await this.page.getByText('E Dominguez StCarson CA 90895-1000').waitFor();
    const loqateAddress = this.page.getByText('E Dominguez StCarson CA 90895-1000');
    await expect(loqateAddress).toBeVisible({ timeout: 5000 });
    await loqateAddress.click({ timeout: 5000 });
    await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(deliveryAdd.phone);
    await this.page.getByRole('button', { name: 'Continue' }).click({ timeout: 60000 });
    await expect(this.page.getByRole('button', { name: 'down-arrow' }).nth(0)).toBeVisible({ timeout: 5000 });
  }

  async avsModal() {
    await expect(this.page.getByRole('heading', { name: 'Address Verification' })).toBeVisible();
    await this.page.getByRole('heading', { name: 'Suggested Address' }).click();
    await this.page.getByRole('button', { name: 'Select Address' }).click();
    await expect(this.page.getByRole('heading', { name: 'Address Verification' })).not.toBeVisible();
    }

  async selectShippingOption(shipOptions: Record<string, string>) {
    console.log('🚚 Selecting shipping option');
    await this.page.waitForLoadState('domcontentloaded');

    const shipOpt = this.page.getByRole('button', { name: new RegExp(shipOptions.shipOption) });
    await expect(shipOpt).toBeVisible();
    await shipOpt.check();

    const continueBtn = this.page.getByRole('button', { name: 'Continue' });
    await expect(continueBtn).toBeVisible({ timeout: 5000 });
    await expect(continueBtn).toBeEnabled();
    await continueBtn.click();
    await expect(this.page.locator('#shipping-section').getByRole('button', { name: 'down-arrow' })).toBeVisible({ timeout: 5000 });
  }


  async fillCreditCardPaymentInfo(creditCard: Record<string, string>) {
    console.log('💰 Filling payment information');
    await this.page.getByRole('textbox', { name: 'Card Number' }).fill(creditCard.number);
    await this.page.getByRole('textbox', { name: 'Expiration Date (MM/YY)' }).fill(creditCard.expiry);
    await this.page.getByRole('textbox', { name: 'CVV' }).fill(creditCard.cvv);
  }


  async fillGiftCardPaymentInfo(giftcard: Record<string, string>) {
    console.log('🎁 Entering gift card information');
    const useGiftCardPayment = this.page.locator('label').filter({ hasText: 'Have a Gift Card?' });
    await useGiftCardPayment.waitFor({ state: 'visible', timeout: 5000 });
    await useGiftCardPayment.click();
    await expect(this.page.getByTestId('gcNum')).toBeVisible();
    await this.page.getByTestId('gcNum').fill(giftcard.e_gift_card_number);
    await this.page.getByTestId('gcAuthNum').fill(giftcard.authorization_number);
    await this.page.getByRole('button', { name: 'Apply Gift Card' }).click();
    await expect(this.page.getByText(/-\$10.00/)).toBeVisible({ timeout: 10000 });
    console.log('🎉 Gift card applied successfully');
  }

  async enterPayOnAccountPaymentInfo(payOnAccount: Record<string, string>){
      console.log('💳 Entering Pay on Account information');
      const areYouPaying = this.page.getByText('Are you paying on account or');
      await expect(areYouPaying).toBeVisible();
      await areYouPaying.click();

      const payOnAcct = this.page.getByText('I would like to Pay on');
      await expect(payOnAcct).toBeVisible();
      await payOnAcct.click();
  
      const poSchool = this.page.getByRole('textbox', { name: 'School/Institution' });
      await expect(poSchool).toBeVisible();
      await poSchool.fill(payOnAccount.schoolName);

      const poNum = this.page.getByRole('textbox', { name: 'PO # (optional)' });
      await expect(poNum).toBeVisible();
      await poNum.fill(payOnAccount.poNumber);
  }

  async uncheckUseDeliveryAddressAsBilling() {
      console.log('Unchecking "Use delivery address as billing address"');
      const useDeliveryAddress = this.page.getByText('Use delivery address as billing address');
      await expect(useDeliveryAddress).toBeVisible();
      await useDeliveryAddress.click();
      await expect(this.page.getByRole('heading', { name: 'Billing Address' })).toBeVisible();
  }

  async fillBillingAddressLoqate(billingAdd: Record<string, string>) {
    console.log('📬 Filling delivery address with Loqate');
    await this.page.getByRole('textbox', { name: 'First Name' }).fill(billingAdd.firstName);
    await this.page.getByRole('textbox', { name: 'Last Name' }).fill(billingAdd.lastName);
    await this.page.getByRole('textbox', { name: 'School/Institution (optional)' }).fill(billingAdd.school);
    await this.page.getByRole('textbox', { name: 'Address 1' }).click();
    await this.page.keyboard.type(billingAdd.address1, { delay: 100 });
    await this.page.getByText('E Dominguez StCarson CA 90895-1000').waitFor();
    const loqateAddress = this.page.getByText('E Dominguez StCarson CA 90895-1000');
    await expect(loqateAddress).toBeVisible({ timeout: 5000 });
    await loqateAddress.click({ timeout: 5000 });
    await this.page.getByRole('textbox', { name: 'Address 2 (optional)' }).fill(billingAdd.address2);
    await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(billingAdd.phone);
    //await this.page.getByRole('button', { name: 'Continue' }).click({ timeout: 60000 });
    //await expect(this.page.getByRole('button', { name: 'down-arrow' }).nth(0)).toBeVisible({ timeout: 5000 });
  }





  async enterBillingInfo(billingAddress: Record<string, string>) {
      console.log('🏠 Filling billing address');
      await this.page.getByRole('textbox', { name: 'First Name' }).fill(billingAddress.firstName);
      await this.page.getByRole('textbox', { name: 'Last Name' }).fill(billingAddress.lastName);
      await this.page.getByRole('textbox', { name: 'Address 1' }).fill(billingAddress.address1);
      await this.page.getByRole('textbox', { name: 'Address 2 (optional)' }).fill(billingAddress.address2);
      await this.page.getByRole('textbox', { name: 'City' }).fill(billingAddress.city);
      await this.page.locator('select[name="state"]').selectOption(billingAddress.state);
      await this.page.getByRole('textbox', { name: 'Zip' }).fill(billingAddress.zip);
      await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(billingAddress.phone);
    }

  async applyTaxExempt() {
      console.log('🧾 Applying tax exempt');
      const taxExempt = this.page.getByRole('checkbox', { name: 'This order is tax exempt.' });
      await expect(taxExempt).toBeVisible();
      await taxExempt.click();
      await expect(this.page.getByText(/Payment is authorized for the/)).toBeVisible();
      await this.page.getByRole('textbox', { name: 'Order Comments' }).fill('TEST ORDER');
    }


  async applyCoupon(couponCode: Record<string, string>) {
    console.log('🏷️ Applying coupon code');
    const couponField = this.page.locator('xpath=(//input[@automation-id="sc_coupon_input"])');
    await expect(couponField).toBeVisible();
    await couponField.fill(couponCode.name);
    await this.page.getByRole('button', { name: 'Apply' }).click();
    await expect(this.page.getByText(`Promo Code ${couponCode.name} has been applied.`)).toBeVisible();
  }


//   async applyGiftCardsFromFile(filePath: string) {
//     let giftCards: GiftCard[] = [];

//   // Step 1: Read and parse the gift card file
//   try {
//     const raw = await fs.readFile(filePath, 'utf-8');
//     const parsed = JSON.parse(raw);

//     if (!Array.isArray(parsed)) {
//       throw new Error('Gift card file must contain an array of gift cards.');
//     }

//     giftCards = parsed;
//   } catch (err) {
//     console.error(`❌ Error reading or parsing gift card file: ${err.message}`);
//     return;
//   }

//   // Step 2: Interact with the UI to enable gift card input
//   try {
//     const useGiftCardPayment = this.page.locator('label').filter({ hasText: 'Have a Gift Card?' });
//     await useGiftCardPayment.waitFor({ state: 'visible', timeout: 5000 });
//     await useGiftCardPayment.click();
//   } catch (err) {
//     console.error(`❌ Failed to interact with gift card UI: ${err.message}`);
//     return;
//   }

//   // Step 3: Try applying each gift card
//   const validCards: GiftCard[] = [];

//   for (const card of giftCards) {
//     if (!this.isValidGiftCard(card)) {
//       console.warn(`⚠️ Invalid gift card structure: ${JSON.stringify(card)}`);
//       continue;
//     }

//     try {
//       const success = await this.tryApplyGiftCard(card);
//       if (success) {
//         validCards.push(card);

//         const formattedAmount = card.amount.toFixed(2);
//         const amountRegex = new RegExp(`\${formattedAmount} applied`);

//         await expect(this.page.getByText(amountRegex)).toBeVisible({ timeout: 1000 });

//         console.log(`✅ Gift card ${card.code} with ${formattedAmount} applied successfully. Exiting loop.`);
//         break;
//       }
//     } catch (err) {
//       console.warn(`⚠️ Error applying gift card ${card.code}: ${err.message}`);
//     }
//   }

//   // Step 4: Write valid cards back to file, removing invalid ones
// try {
//   const validCardsOnly = giftCards.filter(card => this.isValidGiftCard(card));
//   await fs.writeFile(filePath, JSON.stringify(validCardsOnly, null, 2), 'utf-8');
//   console.log(`✅ Updated ${filePath} with ${validCardsOnly.length} valid gift card(s).`);
// } catch (err) {
//   console.error(`❌ Failed to write valid gift cards to file: ${err.message}`);
// }
// await expect(this.page.getByText(/-\$10.00/)).toBeVisible({ timeout: 10000 });
//   console.log(`🎉 Finished processing gift cards. ${validCards.length} valid card(s) applied.`);
// }

// private async tryApplyGiftCard(card: GiftCard): Promise<boolean> {
//   try {
//     await expect(this.page.getByTestId('gcNum')).toBeVisible();
//     await this.page.getByTestId('gcNum').fill(card.e_gift_card_number);
//     await this.page.getByTestId('gcAuthNum').fill(card.authorization_number);
//     await this.page.getByRole('button', { name: 'Apply Gift Card' }).click();

//     console.log(`✅ Gift card applied: ${card.e_gift_card_number}`);
//     return true;
//   } catch (error) {
//     console.warn(`❌ Gift card failed: ${card.e_gift_card_number}`);
//     return false;
//   }
// }

// private isValidGiftCard(card: any): card is GiftCard {
//   return (
//     typeof card.code === 'string' &&
//     typeof card.amount === 'number' &&
//     !isNaN(card.amount) &&
//     typeof card.e_gift_card_number === 'string' &&
//     typeof card.authorization_number === 'string'
//   );
// }





  async submitOrder(expectedTotal: string) {
    console.log('📤 Submitting order');
    await this.page.waitForLoadState('domcontentloaded');
    const url = this.page.url();
    expect(url).not.toMatch(/^https:\/\/www\.lakeshorelearning\.com/);
    expect(url).not.toMatch(/^https:\/\/oclive.*\.llmhq\.com/);
    await expect(this.page.getByText(expectedTotal).last()).toBeVisible();
    const submitButton = this.page.getByRole('button', { name: 'Submit Order' });
    await (submitButton).click();
  }

  async verifyThankYouPage(expectedTotal: string) {
  console.log('✅ Verifying Thank You page');
  await expect(this.page).toHaveURL(/order-confirmation-page/, { timeout: 30000 });

  const thankYouHeading = this.page.getByRole('heading', { name: /Thank You/i });
  await expect(thankYouHeading).toBeVisible({ timeout: 10000 });

  const total1 = this.page.getByText(new RegExp(`Total.*${expectedTotal}`)).first();
  const total2 = this.page.getByText(new RegExp(`${expectedTotal}`)).first();

  if (await total1.isVisible()) {
    await expect(total1).toBeVisible();
  } else if (await total2.isVisible()) {
    await expect(total2).toBeVisible();
  }
}

}
