// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---

interface addressData {
  firstName: string;
  lastName: string;
  school?: string;
  attention?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  country?: string;
}

// --- TEST DATA ---


export const addressData: { [key: string]: addressData } = {
  contiguous: {
    firstName: 'Contiguous',
    lastName: 'User',
    school: 'Test School',
    attention: 'Test Attention',
    address1: '123 Test St',
    address2: 'Suite 100',
    city: 'Testville',
    state: 'CA',
    zip: '90001',
    phone: '(123) 456-7890'
  },
  noncontiguous: {
    firstName: 'NonContiguous',
    lastName: 'User',
    school: 'Test School',
    attention: 'Test Attention',
    address1: '123 Test St',
    address2: 'Suite 100',
    city: 'Testville',
    state: 'HI',
    zip: '96793',
    phone: '(123) 456-7890'
  },
  loqate: {
    firstName: 'Loqate',
    lastName: 'User',
    school: 'Test School',
    attention: 'Test Attention',
    address1: '2695 E Dominguez St.',
    address2: 'Test Address2',
    city: 'Testville',
    state: 'CA',
    zip: '12345',
    phone: '(222) 333-4444'
  },
  noSalesTax: {
    firstName: 'NoSalesTax',
    lastName: 'User',
    address1: '123 Test St',
    city: 'Testville',
    state: 'DE',
    zip: '19706',
    phone: '(123) 456-7890'
  },
  avsAdd: {
    firstName: 'AVS',
    lastName: 'User',
    address1: '41451 almond ave',
    city: 'palmdale',
    state: 'CA',
    zip: '93551',
    phone: '(123) 456-7890'
  },
  billingAdd: {
    firstName: 'playwright',
    lastName: 'user',
    school: 'testBSchool',
    address1: '2695 E Dominguez St',
    address2: 'TestBAddress2',
    city: 'Carson',
    state: 'CA',
    zip: '90895-1000',
    country: 'United States',
    phone: '(111) 222-3333'
  },

};