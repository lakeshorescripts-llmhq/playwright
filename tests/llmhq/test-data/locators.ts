// locators/index.ts
import { Category } from '../types/category';

export const locators: Record<string, Category> = {
    // MAIN NAVIGATION MENU CATEGORIES
    shopAll: {
        role: 'link',
        name: 'Shop All',
        label: 'Shop All'
    },
    shopByAge: {
        role: 'link',
        name: 'Shop by Age',
        label: 'Shop by Age'
    },
    furniture: {
        role: 'link',
        name: 'Furniture',
        label: 'Furniture'
    },
    learn: {
        role: 'link',
        name: 'Learn',
        label: 'Learn'
    },
    play: {
        role: 'link',
        name: 'Play',
        label: 'Play'
    },
    artsAndCrafts: {
        role: 'link',
        name: 'Arts & Crafts',
        label: 'Arts & Crafts'
    },
    teachingSupplies: {
        role: 'link',
        name: 'Teaching Supplies',
        label: 'Teaching Supplies'
    },
    featured: {
        role: 'link',
        name: 'Featured',
        label: 'Featured'
    },
    sale: {
        role: 'link',
        name: 'Sale',
        label: 'Sale'
    },
    furnitureTypes: {
        role: 'tab',
        name: 'Furniture Types',
        label: 'Furniture Types'
    },

    // SHOP ALL CATEGORIES
    shopByCategory:{
        role: 'link',
        name: 'Shop by Category',
        label: 'Shop by Category'
    },
    activePlay:{
        role: 'link',
        name: 'Active Play',
        label: 'Active Play'
    },
    seating: {
        role: 'link',
        name: 'Seating',
        label: 'Seating'
    },
    allSaleItems: {
        role: 'link',
        name: 'All Sale Items',
        label: 'All Sale Items'
    },
    contractedItems: {
        role: 'link',
        name: 'Contracted Items',
        label: 'Contracted Items'
    },

    // SHOP ALL SUBCATEGORIES
    BalanceAndCoordination:{
        role: 'link',
        name: 'Balance & Coordination',
        label: 'Balance & Coordination'
    },
    SportsAndBallActivities:{
        role: 'link',
        name: 'Sports & Ball Activities',
        label: 'Sports & Ball Activities'
    },
    TrikesAndAccessories:{
        role: 'link',
        name: 'Trikes & Accessories',
        label: 'Trikes & Accessories'
    },
    RoomDividers: {
        role: 'link',
        name: 'Room Dividers',
        label: 'Room Dividers'
    },

    // MOBILE NARROW BY CATEGORIES
    mobileNarrowByCategories: {
        role: 'heading',
        name: 'Category',
        label: 'Category'
    },
    mobileNarrowByPrice: {
        role: 'heading',
        name: 'Price',
        label: 'Price'
    },

    // NARROW BY PRICE
    Under10: {
        role: 'checkbox',
        name: 'Under $10',
        label: 'Under $10'
    },
    TenToTwenty: {
        role: 'checkbox',
        name: 'Under $20',
        label: 'Under $20'
    },
    TwentyToThirty: {
        role: 'checkbox',
        name: 'Under $30',
        label: 'Under $30'
    },
    OneHundredAndOver: {
        role: 'checkbox',
        name: '$100 & Above',
        label: '$100 & Above'
    },

    // NARROW BY OCCASION
    BackToSchool: {
        role: 'checkbox',
        name: 'Back to School',
        label: 'Back to School'
    }

    




};
