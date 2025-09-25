// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---

interface PayOnAccount {
    poNumber: string;
    school: string;
}

interface CreditCard {
  number: string;
  expiry: string;
  cvv: string;
}

interface GiftCard {
    e_gift_card_number: string;
    authorization_number: string;
}


// --- TEST DATA ---


export const payOnAccount: { [key: string]: PayOnAccount } = {
  payOnAccount: {
    poNumber: '123-ABC',
    school: 'Test PO School',
  },
};


export const creditCards: { [key: string]: CreditCard } = {
  visa: {
    number: '4111111111111111',
    expiry: '12/25',
    cvv: '111',
  },
  mastercard: {
    number: '5555555555554444',
    expiry: '05/28',
    cvv: '222',
  },
  amex: {
    number: '378282246310005',
    expiry: '10/29',
    cvv: '3333',
  },
  discover: {
    number: '6011000990139424',
    expiry: '01/28',
    cvv: '444',
  },

};

export const giftCards: { [key: string]: GiftCard } = {
    tenDollar: {
        e_gift_card_number: '1713393372995675',
        authorization_number: '8792'
    },
    unlimited: {
        e_gift_card_number: '1234567890123456',
        authorization_number: '1234'
    }
};