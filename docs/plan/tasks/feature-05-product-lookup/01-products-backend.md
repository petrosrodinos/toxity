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

- [ ] Add Product, ProductIngredient, ProductImage, UserProductScan to Prisma
- [ ] Migration
- [ ] `products` module: service + controller
- [ ] `GET /products/barcode/:barcode` — 404 if missing
- [ ] `GET /products/:uuid` — include brand, subcategory+category, ordered ingredients with full ingredient embed
- [ ] `GET /products` — list with filters (featured, category, sort by score/date/popularity)
- [ ] `scans` module: `POST /scans`, `GET /scans`, `GET /scans/recent`
- [ ] On scan: upsert UserProductScan, bump Product.scan_count
- [ ] Seed 2–3 sample products with barcodes for dev testing (e.g. The Ordinary Niacinamide)
- [ ] Register modules

## Technical Notes

- Product detail includes `is_favorited` false until Feature 10
- Verification_status default APPROVED for seeded products

## Acceptance Criteria

- [ ] `GET /products/barcode/1234567890123` returns seeded product or 404
- [ ] `GET /products/:uuid` returns ingredients in position order
- [ ] `POST /scans` creates history; second scan same product updates scanned_at only
- [ ] `GET /scans` returns user's history newest first
