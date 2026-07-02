# Task: Ingredient Database API

## Feature group

Feature 04 — Ingredient Library → [PROGRESS.md](../../PROGRESS.md#feature-04-ingredient-library)

## Objective

Create global ingredient model and API for detail/list — foundation for product ingredient accordions.

## Requirements

- Full Ingredient Prisma model per domain model
- List with search; detail by uuid
- Admin-only create for manual seeding (or internal script) — AI creation comes in Feature 07

## Subtasks

- [x] Add Ingredient model + ColorIndicator and related enums to Prisma
- [x] Migration
- [x] `ingredients` module: controller, service
- [x] `GET /ingredients/:uuid` — full analysis fields
- [x] `GET /ingredients` — search, filter by color_indicator, paginated
- [x] `POST /admin/ingredients` — ADMIN only, for seeding (minimal DTO: name + optional fields)
- [x] Seed 10–20 common ingredients (Water, Glycerin, Niacinamide, etc.) with sample scores for UI dev
- [x] Register in AppModule

## Technical Notes

- Ingredient names unique case-insensitive (normalize to lowercase on insert)
- `references` stored as JSON array

## Acceptance Criteria

- [x] `GET /ingredients` returns seeded ingredients
- [x] `GET /ingredients/:uuid` returns full detail including color_indicator
- [x] Search `?search=niacin` finds Niacinamide
