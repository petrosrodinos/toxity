import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { to_slug } from '../src/shared/utils/slug.utils';
import { BRAND_SEED, TAXONOMY_SEED } from './seed-data/taxonomy';
import { INGREDIENT_SEED } from './seed-data/ingredients';
import { PRODUCT_SEED, PRODUCT_VERIFICATION_STATUS } from './seed-data/products';
import { normalize_ingredient_name } from '../src/shared/utils/ingredient.utils';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function seed_taxonomy() {
    for (const [category_index, category] of TAXONOMY_SEED.entries()) {
        const category_record = await prisma.category.upsert({
            where: { name: category.name },
            create: {
                name: category.name,
                slug: to_slug(category.name),
                sort_order: category_index,
            },
            update: {
                slug: to_slug(category.name),
                sort_order: category_index,
            },
        });

        for (const [subcategory_index, subcategory] of category.subcategories.entries()) {
            await prisma.subcategory.upsert({
                where: {
                    category_uuid_name: {
                        category_uuid: category_record.uuid,
                        name: subcategory.name,
                    },
                },
                create: {
                    category_uuid: category_record.uuid,
                    name: subcategory.name,
                    slug: to_slug(subcategory.name),
                    sort_order: subcategory_index,
                },
                update: {
                    slug: to_slug(subcategory.name),
                    sort_order: subcategory_index,
                },
            });
        }
    }
}

async function seed_brands() {
    for (const brand of BRAND_SEED) {
        await prisma.brand.upsert({
            where: { name: brand.name },
            create: {
                name: brand.name,
                slug: to_slug(brand.name),
                website: brand.website,
                country: brand.country,
            },
            update: {
                slug: to_slug(brand.name),
                website: brand.website,
                country: brand.country,
            },
        });
    }
}

async function seed_ingredients() {
    for (const ingredient of INGREDIENT_SEED) {
        const name_normalized = normalize_ingredient_name(ingredient.name);

        await prisma.ingredient.upsert({
            where: { name_normalized },
            create: {
                name: ingredient.name,
                name_normalized,
                synonyms: ingredient.synonyms ?? [],
                scientific_name: ingredient.scientific_name,
                ai_summary: ingredient.ai_summary,
                benefits: ingredient.benefits,
                risks: ingredient.risks,
                purpose: ingredient.purpose,
                pregnancy_safety: ingredient.pregnancy_safety,
                color_indicator: ingredient.color_indicator,
                overall_score: ingredient.overall_score,
                safety_score: ingredient.safety_score,
                is_vegan: ingredient.is_vegan,
                is_cruelty_free: ingredient.is_cruelty_free,
            },
            update: {
                name: ingredient.name,
                synonyms: ingredient.synonyms ?? [],
                scientific_name: ingredient.scientific_name,
                ai_summary: ingredient.ai_summary,
                benefits: ingredient.benefits,
                risks: ingredient.risks,
                purpose: ingredient.purpose,
                pregnancy_safety: ingredient.pregnancy_safety,
                color_indicator: ingredient.color_indicator,
                overall_score: ingredient.overall_score,
                safety_score: ingredient.safety_score,
                is_vegan: ingredient.is_vegan,
                is_cruelty_free: ingredient.is_cruelty_free,
            },
        });
    }
}

async function seed_products() {
    for (const product of PRODUCT_SEED) {
        const brand = await prisma.brand.findUnique({
            where: { name: product.brand_name },
        });

        if (!brand) {
            throw new Error(`Brand not found for product seed: ${product.brand_name}`);
        }

        const category = await prisma.category.findUnique({
            where: { name: product.subcategory_path.category },
        });

        if (!category) {
            throw new Error(
                `Category not found for product seed: ${product.subcategory_path.category}`,
            );
        }

        const subcategory = await prisma.subcategory.findUnique({
            where: {
                category_uuid_name: {
                    category_uuid: category.uuid,
                    name: product.subcategory_path.subcategory,
                },
            },
        });

        if (!subcategory) {
            throw new Error(
                `Subcategory not found for product seed: ${product.subcategory_path.subcategory}`,
            );
        }

        const product_record = await prisma.product.upsert({
            where: {
                name_brand_uuid: {
                    name: product.name,
                    brand_uuid: brand.uuid,
                },
            },
            create: {
                barcode: product.barcode,
                name: product.name,
                brand_uuid: brand.uuid,
                subcategory_uuid: subcategory.uuid,
                description: product.description,
                ai_summary: product.ai_summary,
                benefits: product.benefits,
                risks: product.risks,
                warnings: product.warnings,
                recommended_usage: product.recommended_usage,
                pregnancy_safety: product.pregnancy_safety,
                is_vegan: product.is_vegan,
                is_cruelty_free: product.is_cruelty_free,
                overall_score: product.overall_score,
                color_indicator: product.color_indicator,
                package_size: product.package_size,
                is_featured: product.is_featured ?? false,
                marketing_claims: product.marketing_claims ?? [],
                verification_status: PRODUCT_VERIFICATION_STATUS,
                faq: product.faq,
            },
            update: {
                barcode: product.barcode,
                subcategory_uuid: subcategory.uuid,
                description: product.description,
                ai_summary: product.ai_summary,
                benefits: product.benefits,
                risks: product.risks,
                warnings: product.warnings,
                recommended_usage: product.recommended_usage,
                pregnancy_safety: product.pregnancy_safety,
                is_vegan: product.is_vegan,
                is_cruelty_free: product.is_cruelty_free,
                overall_score: product.overall_score,
                color_indicator: product.color_indicator,
                package_size: product.package_size,
                is_featured: product.is_featured ?? false,
                marketing_claims: product.marketing_claims ?? [],
                verification_status: PRODUCT_VERIFICATION_STATUS,
                faq: product.faq,
            },
        });

        if (product.hero_image_url) {
            const existing_image = await prisma.productImage.findFirst({
                where: {
                    product_uuid: product_record.uuid,
                    type: 'HERO',
                },
            });

            if (existing_image) {
                await prisma.productImage.update({
                    where: { uuid: existing_image.uuid },
                    data: {
                        url: product.hero_image_url,
                        sort_order: 0,
                    },
                });
            } else {
                await prisma.productImage.create({
                    data: {
                        product_uuid: product_record.uuid,
                        url: product.hero_image_url,
                        type: 'HERO',
                        sort_order: 0,
                    },
                });
            }
        }

        await prisma.productIngredient.deleteMany({
            where: { product_uuid: product_record.uuid },
        });

        for (const item of product.ingredients) {
            const ingredient = await prisma.ingredient.findFirst({
                where: {
                    name_normalized: normalize_ingredient_name(item.name),
                },
            });

            if (!ingredient) {
                throw new Error(`Ingredient not found for product seed: ${item.name}`);
            }

            await prisma.productIngredient.create({
                data: {
                    product_uuid: product_record.uuid,
                    ingredient_uuid: ingredient.uuid,
                    position: item.position,
                },
            });
        }
    }
}

async function main() {
    await seed_taxonomy();
    await seed_brands();
    await seed_ingredients();
    await seed_products();
    console.log('Seed completed: taxonomy + brands + ingredients + products');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
