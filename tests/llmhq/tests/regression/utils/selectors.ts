/**
 * Centralized selectors for Playwright tests.
 * These can be reused across multiple test files for consistency.
 */
export const selectors = {
  searchInput: '[data-testid="search-product-input"]',
  searchButton: '[data-testid="search-product-button"]',
  addToCart: '#right-des-content-add',
  googlePayButton: 'button:has-text("Google Pay")',
  submitOrderButton: 'button:has-text("Submit Order")',
  thankYouHeading: 'role=heading[name=/Thank You/i]',
  totalAmount: /\$17\.89/
};
