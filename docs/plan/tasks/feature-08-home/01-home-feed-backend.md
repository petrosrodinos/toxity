# Task: Home Feed API

## Feature group

Feature 08 — Home & Discovery → [PROGRESS.md](../../PROGRESS.md#feature-08-home--discovery)

## Objective

Aggregated home endpoint with real product data sections.

## Requirements

- `GET /home` returns all sections per API design
- Redis cache per section (TTL 5–15 min)
- `daily_tip` from static config or DB table (simple seed)

## Subtasks

- [ ] `home` module: controller, service
- [ ] `continue_scanning` — from user's recent scans, limit 5
- [ ] `recently_scanned` — same source, limit 10
- [ ] `trending` — products by scan_count DESC, last 7 days optional filter
- [ ] `highest_rated` — overall_score DESC
- [ ] `new_products` — created_at DESC
- [ ] `recommended` — featured first, then high score (simple algo; personalize later)
- [ ] `categories` — top-level categories with image/icon
- [ ] `ingredient_spotlight` — random or curated ingredient
- [ ] `daily_tip` — from `shared/config/daily-tips.ts` rotated by day
- [ ] Cache keys in Redis via redis-cache module

## Technical Notes

- Empty sections return `[]` not error
- Product cards use slim DTO (uuid, name, brand, image, score, color)

## Acceptance Criteria

- [ ] `GET /home` returns all sections with correct shapes
- [ ] After user scans products, `continue_scanning` and `recently_scanned` populate
- [ ] Trending/highest_rated reflect seeded/real products
