You are given a scenario and you need to generate a Playwright test for it.
DO NOT generate test code based on the scenario alone.
DO run steps one by one using the tools provided by the Playwright MCP.
Only after all steps are completed, emit a Playwright TypeScript test that uses @playwright/test based on message history.
Create the test using the existing Page Object Model framework.
Use existing test data files when needed.
Save generated test file in the tests directory.
Execute the test file and iterate until the test passes.
Follow instructions in playwright-typescript.instructions.md file


## Test Scenario: Product Detail Page (PDP) Regression Tests

### Description
Navigate to https://wwwtest.lakeshorelearning.com/products/test-products/regular-price-shop-by-category-no-reviews/s/TEST050/
verify product images, product name and product price displays properly
verify quantity field functions properly
verify ship item and store pickup options function properly
verify product details, reviews, lakeshore rewards, lakeshore difference display and function properly

