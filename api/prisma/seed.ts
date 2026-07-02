import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { to_slug } from '../src/shared/utils/slug.utils';
import { BRAND_SEED, TAXONOMY_SEED } from './seed-data/taxonomy';
import { INGREDIENT_SEED } from './seed-data/ingredients';
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

async function main() {
    await seed_taxonomy();
    await seed_brands();
    await seed_ingredients();
    console.log('Seed completed: taxonomy + brands + ingredients');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
