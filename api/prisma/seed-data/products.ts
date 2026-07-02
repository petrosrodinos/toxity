import {
    ColorIndicator,
    ProductImageType,
    SafetyLevel,
    VerificationStatus,
} from '../../src/generated/prisma';

export type ProductSeedIngredient = {
    name: string;
    position: number;
};

export type ProductSeedEntry = {
    barcode: string;
    name: string;
    brand_name: string;
    subcategory_path: {
        category: string;
        subcategory: string;
    };
    description?: string;
    ai_summary: string;
    benefits?: string;
    risks?: string;
    warnings?: string;
    recommended_usage?: string;
    pregnancy_safety?: SafetyLevel;
    is_vegan?: boolean;
    is_cruelty_free?: boolean;
    overall_score: number;
    color_indicator: ColorIndicator;
    package_size?: string;
    is_featured?: boolean;
    marketing_claims?: string[];
    hero_image_url?: string;
    ingredients: ProductSeedIngredient[];
    faq?: Array<{ question: string; answer: string }>;
};

export const PRODUCT_SEED: ProductSeedEntry[] = [
    {
        barcode: '1234567890123',
        name: 'Niacinamide 10% + Zinc 1%',
        brand_name: 'The Ordinary',
        subcategory_path: {
            category: 'Beauty',
            subcategory: 'Moisturizers',
        },
        description:
            'High-strength vitamin and mineral blemish formula with 10% niacinamide and 1% zinc.',
        ai_summary:
            'Well-tolerated serum for oil control, redness, and pore appearance with a strong safety profile.',
        benefits:
            'Reduces blemishes, balances sebum, supports an even skin tone.',
        risks: 'Mild tingling possible when layered with strong acids.',
        warnings: 'Patch test if you have very sensitive skin.',
        recommended_usage: 'Apply a few drops to face AM and/or PM before heavier creams.',
        pregnancy_safety: SafetyLevel.SAFE,
        is_vegan: true,
        is_cruelty_free: true,
        overall_score: 17.2,
        color_indicator: ColorIndicator.SAFE,
        package_size: '30ml',
        is_featured: true,
        marketing_claims: ['vegan', 'cruelty-free'],
        hero_image_url: 'https://images.toxity.dev/products/the-ordinary-niacinamide.jpg',
        ingredients: [
            { name: 'Water', position: 1 },
            { name: 'Niacinamide', position: 2 },
            { name: 'Glycerin', position: 3 },
            { name: 'Phenoxyethanol', position: 4 },
        ],
        faq: [
            {
                question: 'Can I use this with vitamin C?',
                answer:
                    'Many users combine them; if irritation occurs, separate AM/PM usage.',
            },
        ],
    },
    {
        barcode: '8500034567890',
        name: 'Moisturizing Cream',
        brand_name: 'CeraVe',
        subcategory_path: {
            category: 'Beauty',
            subcategory: 'Moisturizers',
        },
        description:
            'Daily face and body moisturizer with ceramides and hyaluronic acid.',
        ai_summary:
            'Barrier-supporting moisturizer suitable for most skin types with a very safe ingredient profile.',
        benefits: 'Restores moisture barrier, long-lasting hydration.',
        risks: 'Rare sensitivity to silicones in some users.',
        recommended_usage: 'Apply to clean skin as needed, morning and night.',
        pregnancy_safety: SafetyLevel.SAFE,
        is_vegan: false,
        is_cruelty_free: true,
        overall_score: 18.1,
        color_indicator: ColorIndicator.VERY_SAFE,
        package_size: '340g',
        is_featured: true,
        marketing_claims: ['fragrance-free', 'dermatologist-developed'],
        hero_image_url: 'https://images.toxity.dev/products/cerave-moisturizing-cream.jpg',
        ingredients: [
            { name: 'Water', position: 1 },
            { name: 'Ceramides', position: 2 },
            { name: 'Hyaluronic Acid', position: 3 },
            { name: 'Glycerin', position: 4 },
            { name: 'Dimethicone', position: 5 },
        ],
    },
    {
        barcode: '7613034626844',
        name: 'KitKat 4 Finger',
        brand_name: 'Nestlé',
        subcategory_path: {
            category: 'Food',
            subcategory: 'Snacks',
        },
        description: 'Crisp wafer fingers covered in milk chocolate.',
        ai_summary:
            'Occasional treat with moderate sugar and processed ingredients; not for daily nutrition.',
        benefits: 'Quick energy from carbohydrates.',
        risks: 'High sugar; not suitable for frequent consumption.',
        warnings: 'Contains milk and wheat; may contain nuts.',
        pregnancy_safety: SafetyLevel.CAUTION,
        overall_score: 8.5,
        color_indicator: ColorIndicator.MODERATE,
        package_size: '41.5g',
        ingredients: [
            { name: 'Water', position: 1 },
            { name: 'Glycerin', position: 2 },
        ],
    },
];

export const PRODUCT_VERIFICATION_STATUS = VerificationStatus.APPROVED;
