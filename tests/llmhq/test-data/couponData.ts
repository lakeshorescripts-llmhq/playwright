// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---

interface coupon {
    couponCode: string;
}


// --- TEST DATA ---


export const coupon: { [key: string]: coupon } = {

    percentOffcoupon: {
        couponCode: '20OFF',
    },
    freeShippingCoupon: {
        couponCode: 'testfs',
    },
    tieredCoupon: {
        couponCode: 'testTIERED',
    },
    bogo: {
        couponCode: 'TESTBOGO',
    },
    fiveShip: {
        couponCode: '5SHIP',
    },

}