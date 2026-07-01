# Task: Categories, Subcategories & Brands API

## Feature group

Feature 03 — Taxonomy Foundation → [PROGRESS.md](../../PROGRESS.md#feature-03-taxonomy-foundation)

## Objective

Implement global taxonomy and brand entities with seed data and read APIs.

## Requirements

- Prisma models: Category, Subcategory, Brand per domain model
- Seed script with spec categories (Beauty, Healthcare, Food, etc.)
- Public/authenticated read endpoints for app consumption

## Subtasks

- [ ] Add Category, Subcategory, Brand models to Prisma schema
- [ ] Migration + `prisma/seed.ts` with full category tree from spec
- [ ] `categories` module: `GET /categories` (tree), `GET /categories/:uuid/products` (empty until products exist)
- [ ] `brands` module: `GET /brands`, `GET /brands/:uuid`
- [ ] Zod query schemas for pagination/search on brands list
- [ ] Register modules in AppModule
- [ ] Swagger documentation

## Technical Notes

- Slug generation from name (kebab-case utility in `shared/utils`)
- Products endpoint returns empty paginated list until Feature 05 — still valid for testing

## Acceptance Criteria

- [ ] `GET /categories` returns nested tree with all spec subcategories
- [ ] `GET /brands?search=ordinary` returns paginated brands (after manual seed or first product)
- [ ] Seed runs cleanly on fresh DB: `npx prisma db seed`
