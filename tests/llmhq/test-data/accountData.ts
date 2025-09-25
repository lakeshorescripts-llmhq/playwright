// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---


interface User {
  email: string;
  password?: string; // Password should be loaded from environment variables
}


// --- TEST DATA ---


export const users: { [key: string]: User } = {
  // Passwords should be stored in environment variables, not here.
  // Example: password: process.env.PLAYWRIGHT_PASSWORD
  playwright: {
    email: 'dqplaywright@llmhq.com',
    password: 'aA#1234567',
  },
  playwright1: {
    email: 'dqplaywright1@llmhq.com',
    password: 'aA#1234567',
  },
  loyaltyMember: {
    email: 'loyalty@llmhq.com',
    password: 'a1234567',
  },
  gsaMember: {
    email: 'smoketest_gsa@lakeshorelearning.com',
    password: 'aA#1234567',
  },
};