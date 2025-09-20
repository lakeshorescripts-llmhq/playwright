// Best Practices for Test Data Management
// 1. Use TypeScript interfaces to define the shape of your data.
// 2. Separate data into logical groups.
// 3. Use environment variables for sensitive data like passwords and API keys.
// 4. Consider using a data generation library like Faker.js for more robust testing.

// --- INTERFACES ---

interface shipOptions {
    shipOption: string;
}


// --- TEST DATA ---


export const shipOptions: { [key: string]: shipOptions } = {
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
};