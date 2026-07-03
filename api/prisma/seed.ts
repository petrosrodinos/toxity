import { PrismaClient } from '../src/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { to_slug } from '../src/shared/utils/slug.utils';
import { TAXONOMY_SEED } from './seed-data/taxonomy';

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function seed_taxonomy() {
    const seen_categories = new Set<string>();

    for (const [category_index, category] of TAXONOMY_SEED.entries()) {
        const category_name = category.name.trim();
        const category_key = category_name.toLowerCase();

        if (seen_categories.has(category_key)) {
            console.warn(
                `Skipping duplicate category in seed data: "${category_name}"`,
            );
            continue;
        }
        seen_categories.add(category_key);

        const category_record = await prisma.category.upsert({
            where: { name: category_name },
            create: {
                name: category_name,
                slug: to_slug(category_name),
                sort_order: category_index,
            },
            update: {
                slug: to_slug(category_name),
                sort_order: category_index,
            },
        });

        const seen_subcategories = new Set<string>();

        for (const [
            subcategory_index,
            subcategory,
        ] of category.subcategories.entries()) {
            const subcategory_name = subcategory.name.trim();
            const subcategory_key = subcategory_name.toLowerCase();

            if (seen_subcategories.has(subcategory_key)) {
                console.warn(
                    `Skipping duplicate subcategory "${subcategory_name}" under category "${category_name}"`,
                );
                continue;
            }
            seen_subcategories.add(subcategory_key);

            await prisma.subcategory.upsert({
                where: {
                    category_uuid_name: {
                        category_uuid: category_record.uuid,
                        name: subcategory_name,
                    },
                },
                create: {
                    category_uuid: category_record.uuid,
                    name: subcategory_name,
                    slug: to_slug(subcategory_name),
                    sort_order: subcategory_index,
                },
                update: {
                    slug: to_slug(subcategory_name),
                    sort_order: subcategory_index,
                },
            });
        }
    }
}

async function main() {
    await seed_taxonomy();
    console.log('Seed completed: categories + subcategories');
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
