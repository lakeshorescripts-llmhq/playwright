export const dataVariables = {


  // SEARCH
  keywordSearch: 'Regular Price - Shop by Category - No Reviews',
  skuSearch: 'TEST050',
  noSearchResults: 'JHGHJGLuiouokjhkjh',

  // SORT OPTIONS
  sortByPriceLowToHigh: {
    role: 'option',
    name: 'Price - Low',
  },
  sortByPriceHighToLow: {
    role: 'option',
    name: 'Price - High',
  },

  // FILTERS
  filters: {
    subCategory: 'Balance & Coordination',
    price: 'Under $10'
  },


  // PRODUCTS
  WD111: {
    name: 'Big Bubbles',
    sku: 'WD111',
    price: '$12.99',
  },
  CW527: {
    name: 'Swing and Catch Cups',
    option: 'Set of 6',
  },
  LC511: {
    name: 'Flex-Space Wobble Cushion',
    option: 'Each',
    sku: 'LC511',
    price: '29.99',
    qty: "5",
  },
  TEST050: {
    name: 'Regular Price - Shop by Category - No Reviews',
    sku: 'TEST050',
    price: '9.99',
    qty: "5",
  },
  TEST051: {
    name: 'On Sale - Shop by Age - Loyalty Eligibility - In Stock',
    sku: 'TEST051',
    price: '5,014.54',
    qty: "11",
  },
  TEST053A: {
    name: 'accessory of TEST053',
    sku: 'TEST053A',
    price: '$0.59',
    qty: "10",
  },
  GSA: {
    name: 'Write & Wipe U.S.A. Wall Map',
    sku: 'WT109',
    price: '$26.59',
    qty: "4",
  },
  FurnitureTab: {
    name: 'Connective Furniture Connectors',
    option: '18 1/2"h',
    sku: 'DD634',
    price: '$24.99',
    qty: "1",
  },

  // QUANTITIES
  fiveQty: {
    quantity: 5,
  },
  tenQty: {
    quantity: 10,
  },
  fifteenQty: {
    quantity: 15,
  },

  // COUPONS
  percentOffcoupon: {
    name: '20OFF',
  },
  freeShippingCoupon: {
    name: 'testfs',
  },
  tieredCoupon: {
    name: 'testTIERED',
    tiers: [
      { min: 25, discount: '-$5' },
      { min: 50, discount: '-$10' },
      { min: 75, discount: '-$15' },
    ],
  },


  // EMAILS
  emailContact1: {
    email: 'dqueza@lakeshorelearning.com',
  },
  emailContact2: {
    email: 'lakeshorescripts@gmail.com',
  },
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
    password: 'a1234567',
  },

  // STORE PICKUP INFO
  additionalInfo: {
    phone: '(999) 999-9999',
    firstName: 'addFirst',
    lastName: 'addLast',
    email: 'addPickup@llmhq.com'
  },


  // DELIVERY ADDRESSES
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
    zipCode: '90895-1000',
    country: 'United States',
    phone: '(111) 222-3333'
  },


  // SHIPPING OPTIONS
  standard: {
    shipOption: 'Standard',
  },
  secondDayAir: {
    shipOption: '2nd Day Air',
  },
  nextDayAir: {
    shipOption: 'Next Day Air',
  },
  priority: {
    shipOption: 'Priority',
  },

  // PAY ON ACCOUNT
  payOnAccount: {
    poNumber: '123-ABC',
    schoolName: 'Test PO School',
  },


  // CREDIT CARDS
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


  // GIFT CARDS
  tenDollarGiftCard: {
    e_gift_card_number: '1713393372995675',
    authorization_number: '8792'
  },
  unlimitedGiftCard: {
    e_gift_card_number: '1234567890123456',
    authorization_number: '1234'
  }



};
