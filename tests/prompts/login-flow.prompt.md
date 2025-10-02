# Metadata
- Scenario: Buyer login flow
- Role: cc3_buyer
- Environment: UAT
- Priority: High

# Test Objective
Generate a Playwright test in TypeScript that verifies a successful login flow for the Lakeshore eProcurement portal.

# Test Steps
1. Navigate to https://eprouat.llmhq.com/login.
2. Locate the username field using `input[name="username"]` and enter "cc3_buyer".
3. Locate the password field using `input[name="password"]` and enter "a1234567".
4. Click the "Sign In" button using `button:has-text("Sign In")`.
5. Wait for navigation to complete.
6. Verify that the user lands on the dashboard page:
   - Confirm the URL contains `/dashboard` or similar.
   - Check for a visible dashboard-specific element (e.g., navigation bar, welcome message).

# Test Requirements
- Use TypeScript syntax.
- Follow Playwright best practices:
  - Avoid hard-coded waits.
  - Prefer semantic or role-based locators.
  - Include assertions for both URL and visible dashboard elements.
- Structure the test using the Page Object Model.
- Store locators and test data in separate files if applicable.
- Handle login failure gracefully:
  - If login fails, assert that an error message is displayed.
  - Confirm the user remains on the login page.

# Execution Instructions
- You are given a scenario and must generate a Playwright test for it.
- DO NOT generate test code based on the scenario alone.
- DO run each step interactively using the tools provided by Playwright MCP.
- ONLY AFTER all steps are completed, emit a Playwright TypeScript test that:
  - Uses the Page Object Model
  - Applies semantic selectors from the login page
  - Includes robust assertions
  - Handles both success and failure paths
