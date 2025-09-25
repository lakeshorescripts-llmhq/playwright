import { faker } from '@faker-js/faker';

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface ProductData {
  name: string;
  sku: string;
  price: number;
  quantity: number;
}

export class TestDataFactory {
  static createCustomer(overrides?: Partial<CustomerData>): CustomerData {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      },
      ...overrides,
    };
  }

  static createProduct(overrides?: Partial<ProductData>): ProductData {
    return {
      name: faker.commerce.productName(),
      sku: faker.string.alphanumeric(8).toUpperCase(),
      price: parseFloat(faker.commerce.price()),
      quantity: faker.number.int({ min: 1, max: 10 }),
      ...overrides,
    };
  }
}

export class TestDataCleaner {
  static async cleanupTestData() {
    // Add cleanup logic here
    // For example: delete test orders, customers, etc.
  }
}

export class TestDataValidator {
  static validateCustomerData(data: CustomerData): boolean {
    return !!(
      data.firstName &&
      data.lastName &&
      data.email &&
      data.email.includes('@') &&
      data.phone &&
      data.address.street &&
      data.address.city &&
      data.address.state &&
      data.address.zip
    );
  }

  static validateProductData(data: ProductData): boolean {
    return !!(
      data.name &&
      data.sku &&
      data.sku.length === 8 &&
      data.price > 0 &&
      data.quantity > 0
    );
  }
}