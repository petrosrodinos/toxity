# Task: Product Model & Barcode Lookup

## Feature group

Feature 05 — Product Lookup (Existing Product) → [PROGRESS.md](../../PROGRESS.md#feature-05-product-lookup-existing-product)

## Objective

Implement global Product entity, barcode lookup, product detail API, and user scan recording.

## Requirements

- Product, ProductIngredient, ProductImage models
- Link to Brand, Subcategory, Ingredient
- Barcode unique lookup; increment scan_count on scan
- UserProductScan creation

## Subtasks

- [x] Add Product, ProductIngredient, ProductImage, UserProductScan to Prisma
- [x] Migration
- [x] `products` module: service + controller
- [x] `GET /products/barcode/:barcode` — 404 if missing
- [x] `GET /products/:uuid` — include brand, subcategory+category, ordered ingredients with full ingredient embed
- [x] `GET /products` — list with filters (featured, category, sort by score/date/popularity)
- [x] `scans` module: `POST /scans`, `GET /scans`, `GET /scans/recent`
- [x] On scan: upsert UserProductScan, bump Product.scan_count
- [x] Seed 2–3 sample products with barcodes for dev testing (e.g. The Ordinary Niacinamide)
- [x] Register modules

## Technical Notes

- Product detail includes `is_favorited` false until Feature 10
- Verification_status default APPROVED for seeded products

## Acceptance Criteria

- [x] `GET /products/barcode/1234567890123` returns seeded product or 404
- [x] `GET /products/:uuid` returns ingredients in position order
- [x] `POST /scans` creates history; second scan same product updates scanned_at only
- [x] `GET /scans` returns user's history newest first
