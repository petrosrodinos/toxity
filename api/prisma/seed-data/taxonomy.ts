export type TaxonomySeedSubcategory = {
    name: string;
};

export type TaxonomySeedCategory = {
    name: string;
    subcategories: TaxonomySeedSubcategory[];
};

export const TAXONOMY_SEED: TaxonomySeedCategory[] = [
    {
        name: 'Beauty',
        subcategories: [
            { name: 'Moisturizers' },
            { name: 'Cleansers' },
            { name: 'Sunscreens' },
            { name: 'Shampoo' },
            { name: 'Conditioner' },
            { name: 'Hair Oil' },
        ],
    },
    {
        name: 'Healthcare',
        subcategories: [
            { name: 'Medicines' },
            { name: 'Pain Relief' },
            { name: 'First Aid' },
        ],
    },
    {
        name: 'Food',
        subcategories: [
            { name: 'Snacks' },
            { name: 'Dairy' },
            { name: 'Frozen Food' },
            { name: 'Drinks' },
        ],
    },
    {
        name: 'Supplements',
        subcategories: [
            { name: 'Vitamins' },
            { name: 'Minerals' },
            { name: 'Protein' },
        ],
    },
    {
        name: 'Cleaning',
        subcategories: [
            { name: 'Laundry' },
            { name: 'Surface Cleaner' },
            { name: 'Dishwashing' },
        ],
    },
    {
        name: 'Pet Care',
        subcategories: [
            { name: 'Dog Food' },
            { name: 'Cat Food' },
        ],
    },
    {
        name: 'Baby',
        subcategories: [
            { name: 'Baby Lotion' },
            { name: 'Formula' },
        ],
    },
];

export const BRAND_SEED = [
  { name: 'The Ordinary', website: 'https://theordinary.com', country: 'Canada' },
  { name: 'CeraVe', website: 'https://www.cerave.com', country: 'USA' },
  { name: 'La Roche-Posay', website: 'https://www.laroche-posay.com', country: 'France' },
  { name: 'Nestlé', website: 'https://www.nestle.com', country: 'Switzerland' },
  { name: 'Dove', website: 'https://www.dove.com', country: 'UK' },
];
