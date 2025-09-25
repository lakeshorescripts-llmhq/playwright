---
description: 'Playwright test generation instructions'
applyTo: '**'
---

## Test Writing Guidelines

### Code Quality Standards
- **Locators**: Prioritize user-facing, role-based locators (`getByRole`, `getByLabel`, `getByText`, etc.) for resilience and accessibility. Use `test.step()` to group interactions and improve test readability and reporting.
- **Assertions**: Use auto-retrying web-first assertions. These assertions start with the `await` keyword (e.g., `await expect(locator).toHaveText()`). Avoid `expect(locator).toBeVisible()` unless specifically testing for visibility changes.
- **Timeouts**: Rely on Playwright's built-in auto-waiting mechanisms. Avoid hard-coded waits or increased default timeouts.
- **Clarity**: Use descriptive test and step titles that clearly state the intent. Add comments only to explain complex logic or non-obvious interactions.
- **Error Handling**: Avoid try-catch blocks unless absolutely necessary. Let tests fail naturally to surface issues.
- **Reusability**: Leverage the existing Page Object Model (POM) framework for reusable components and actions. Avoid duplicating code across tests.
- **Performance**: Write efficient tests that minimize unnecessary actions or page reloads. Use `test.describe.configure({ mode: 'parallel' })` to run independent tests concurrently.
- **Maintainability**: Regularly review and refactor tests to ensure they remain relevant and effective as the application evolves.
- **Version Control**: Commit test code to version control with clear commit messages. Use branches for significant changes or new features.



### Test Structure
- **Imports**: Start with `import { test, expect } from '@playwright/test';`.
- **Organization**: Group related tests for a feature under a `test.describe()` block.
- **Hooks**: Use `beforeEach` for setup actions common to all tests in a `describe` block (e.g., navigating to a page).
- **Titles**: Follow a clear naming convention, such as `Feature - Specific action or scenario`.
- **Framework**: Leverage the existing Page Object Model (POM) framework for reusable components and actions.



### File Organization
- **Location**: Store all test files in the `tests/` directory.
- **Naming**: Use the convention `<feature-or-page>.spec.ts` (e.g., `login.spec.ts`, `search.spec.ts`).
- **Scope**: Aim for one test file per major application feature or page.
- **Modularity**: Break down large test files into smaller, focused files as needed.
- **Test Data**: Store test data in the `test-data/` directory, using separate files for locators and data variables.
- **Page Objects**: Store reusable page components and actions in the `pages/` directory.
- **Utilities**: Place helper functions and custom matchers in the `utils/` directory.
- **Configuration**: Keep Playwright configuration in `playwright.config.ts` at the root level.
- **Fixtures**: Define custom fixtures in `fixtures/` if needed for shared setup or teardown logic.
- **Reports**: Configure test reports to be generated in the `reports/` directory for easy access and review.
- **Screenshots**: Store screenshots in the `screenshots/` directory, organized by test run date or feature.
- **Videos**: Save test execution videos in the `videos/` directory for debugging purposes.
- **Logs**: Maintain logs in the `logs/` directory for tracking test execution details.
- **Version Control**: Use `.gitignore` to exclude sensitive data, node modules, and large files from version control.
- **Documentation**: Maintain a `docs/` directory for any additional documentation related to testing practices or guidelines.
- **Dependencies**: Keep `package.json` and `package-lock.json` at the root level for managing project dependencies.

### Assertion Best Practices
- **UI Structure**: Use `toMatchAriaSnapshot` to verify the accessibility tree structure of a component. This provides a comprehensive and accessible snapshot.
- **Element Counts**: Use `toHaveCount` to assert the number of elements found by a locator.
- **Text Content**: Use `toHaveText` for exact text matches and `toContainText` for partial matches.
- **Navigation**: Use `toHaveURL` to verify the page URL after an action.


## Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CategoryPage } from '../../pages/CategoryPage';
import { locators } from '../../test-data/locators';
import { dataVariables } from '../../test-data/dataVariables';




test.describe('PLP Regression Tests', () => {
    // Configure tests to run parallel (at the same time based on # of workers set)
    test.describe.configure({ mode: 'parallel' });
    
    const filterOption = locators.BackToSchool;
    const sortOption = dataVariables.sortByPriceHighToLow;

    let homePage: HomePage;
    let categoryPage: CategoryPage;
   
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        categoryPage = new CategoryPage(page);
   
        // Clear state before each test
        await page.context().clearCookies();
        await page.reload();
        await homePage.navigateTo();
        await homePage.closeConsentBanner();
        await expect(page.locator('#onetrust-group-container')).not.toBeVisible();
        await page.waitForLoadState('domcontentloaded');
    });

  test('Page should load correctly', async ({page}) => {
    await homePage.clickGiftCards();
    await expect(page.getByRole('link', { name: 'Here’s to a Bright School' })).toBeVisible();
  });

  test('Filter by Card Type', async ({page}) => {
    await homePage.clickGiftCards();
    const egcFilter = page.getByRole('listitem').filter({ hasText: 'E-Gift Card (' }).locator('#checkbox-');
    const egcHeader = page.getByText('E-Gift Cards', { exact: true });
    const gcHeader = page.getByText('Physical Gift Cards');
    await expect(egcHeader).toBeVisible();
    await expect(gcHeader).toBeVisible();
    await (egcFilter).click();
    await expect(egcHeader).toBeVisible();
    await expect(gcHeader).not.toBeVisible();
  });
});
```

## Test Execution Strategy

1. **Initial Run**: Execute tests with `npx playwright test --project=chromium`
2. **Debug Failures**: Analyze test failures and identify root causes
3. **Iterate**: Refine locators, assertions, or test logic as needed
4. **Validate**: Ensure tests pass consistently and cover the intended functionality
5. **Report**: Provide feedback on test results and any issues discovered

## Quality Checklist

Before finalizing tests, ensure:
- [ ] All locators are accessible and specific and avoid strict mode violations
- [ ] Tests are grouped logically and follow a clear structure
- [ ] Assertions are meaningful and reflect user expectations
- [ ] Tests follow consistent naming conventions
- [ ] Code is properly formatted and commented
- [ ] Tests are efficient and avoid unnecessary waits or actions
- [ ] Tests are maintainable and reusable components are leveraged
- [ ] Test data is managed effectively and avoids hard-coded values
