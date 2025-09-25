import { test, expect } from '@playwright/test';
import { HomePage } from './llmhq/pages/HomePage';
import { users } from './llmhq/test-data/accountData';

test.describe('Login Tests', () => {
    test.describe.configure({ mode: 'parallel' });

    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.navigateTo();
        await homePage.closeConsentBanner();
    });

    test('Login from header', async ({ page }) => {
        await test.step('Hover over Account icon and click Sign In', async () => {
            await homePage.signInFromHeader();
        });

        await test.step('Fill email and password and click Sign In', async () => {
            await homePage.enterSignInCredentials(users.playwright1);
        });

        await test.step('Verify URL', async () => {
            await expect(page).toHaveURL('/');
        });
    });
});