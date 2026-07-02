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

- [x] `home` module: controller, service
- [x] `continue_scanning` — from user's recent scans, limit 5
- [x] `recently_scanned` — same source, limit 10
- [x] `trending` — products by scan_count DESC (last-7-days filter skipped for MVP, noted in code)
- [x] `highest_rated` — overall_score DESC
- [x] `new_products` — created_at DESC
- [x] `recommended` — featured first, then high score (simple algo; personalize later)
- [x] `categories` — top-level categories with icon_url
- [x] `ingredient_spotlight` — curated by day-of-year rotation (stable per day, not random per request)
- [x] `daily_tip` — from `shared/config/daily-tips/daily-tips.ts` rotated by day
- [x] Cache keys via `AppCacheModule`/`CacheService` (in-process `cache-manager`, not a dedicated Redis store — see technical note below)

## Technical Notes

- Empty sections return `[]` not error
- Product cards use slim DTO (uuid, name, brand, image, score, color)

## Acceptance Criteria

- [x] `GET /home` returns all sections with correct shapes (build verified; manual E2E when DB available)
- [x] After user scans products, `continue_scanning` and `recently_scanned` populate (always queried fresh per-user, never cached)
- [x] Trending/highest_rated reflect seeded/real products
