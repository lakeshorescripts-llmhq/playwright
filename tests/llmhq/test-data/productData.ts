// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---
interface productData {
  name: string;
  sku: string;
  price: number;
  quantity: number;
  option?: string;
  option2?: string;
}

export const productData: { [key: string]: productData } = {
  twodropdowns: {
    name: 'Ship Only - Dropdowns',
    option: 'Large',
    option2: 'Blue',
    sku: 'TEST054CBU',
    price: 29.99, // Standardize to number
    quantity: 1,
  },
  onedropdown: {
    name: 'Store Only - Dropdown',
    option: 'Violet',
    sku: 'TEST056A',
    price: 11.99,
    quantity: 1,
  },
  regular: {
    name: 'Regular Price - Shop by Category - No Reviews',
    sku: 'TEST050',
    price: 9.99,
    quantity: 5,
  },
  sale: {
    name: 'On Sale - Shop by Age - Loyalty Eligibility - In Stock',
    sku: 'TEST051',
    price: 5014.54,
    quantity: 11,
  },
  clearance: {
    name: 'Clearance - Shop by Grade - Shipping Restrictions - Reviews',
    sku: 'TEST052',
    price: 5000.56,
    quantity: 11,
  },
  gsa: {
    name: 'accessory of TEST053',
    sku: 'TEST053A',
    price: 0.59,
    quantity: 1,
  },
  personalized: {
    name: 'Personalized - Accessories',
    sku: 'TEST055',
    option: 'FIRST LAST',
    price: 100.00,
    quantity: 1,
  }
};
