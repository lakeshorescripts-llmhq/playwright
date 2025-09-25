import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const now = new Date();
const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
const newUserEmail = `qa-${timestamp}@llmhq.com`;
const newUserPassword = 'aA#1234567';

const storagePath = path.resolve('storage');
const statePath = path.join(storagePath, 'state.json');
const userInfoPath = path.join(storagePath, 'user.json');

// Ensure storage folder exists
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath);
}

test('Create a new account and save login state', async ({ page }) => {
  console.log('🧪 Creating a new account...');

  // Check for existing state
  if (fs.existsSync(statePath) && fs.statSync(statePath).size > 0) {
    try {
      console.log('🔄 Existing state found. Proceeding...');
    } catch {
      console.warn('⚠️ Failed to parse state.json. Skipping cookie clearing.');
    }
  } else {
    // Create an empty state.json if it does not exist
    if (!fs.existsSync(statePath)) {
      fs.writeFileSync(statePath, JSON.stringify({ cookies: [], origins: [] }, null, 2));
      console.log('📝 Created empty state.json.');
    } else {
      console.warn('⚠️ state.json is empty. Skipping cookie clearing.');
    }
  }

  await page.goto('/', { waitUntil: 'domcontentloaded' });

  await test.step('Navigate to Create Account page', async () => {
    const accountIcon = page.getByTestId('signin-icon-link').nth(0);
    await expect(accountIcon).toBeVisible({ timeout: 15000 });
    await accountIcon.hover();
    await page.getByRole('button', { name: 'Create Account', exact: true }).click();
  });

  await test.step('Fill out account creation form', async () => {
    await page.getByTestId('first-name-account').fill('new');
    await page.getByTestId('last-name-account').fill('user');
    await page.getByTestId('email-account').fill(newUserEmail);
    await page.getByTestId('input-pass-create').fill(newUserPassword);
    await page.getByTestId('phone-number-account').fill('1234567890');
    await page.getByTestId('postal-code-account').fill('90895');
    await page.locator('label').filter({ hasText: 'Classroom/Organization' }).locator('div').click();
    await page.getByTestId('keep-signed-in-account').check();
    await page.getByTestId('submit-button-create').click();
  });

  await test.step('Verify account creation and save state', async () => {
    await expect(page).toHaveURL('/my-account/');
    await expect(page.getByRole('main')).toContainText('Welcome, new! VIP Sign Out');

    await page.context().storageState({ path: statePath });

    fs.writeFileSync(userInfoPath, JSON.stringify({ email: newUserEmail, password: newUserPassword }, null, 2));
    console.log(`✅ Account created: ${newUserEmail}`);
  });
});

test.use({ storageState: statePath });

test('Delete test account', async ({ page }) => {
  console.log('🧹 Deleting the test account...');

  await page.goto('/my-account/');
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Delete My Account' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByRole('heading', { name: 'Your Account Has Been Deleted' })).toBeVisible();
  await page.getByRole('button', { name: 'OK' }).click();
  await expect(page.getByRole('banner')).toContainText('Account');

  console.log('✅ Test account deleted.');
});
