# Task: Unified Search API & UI

## Feature group

Feature 09 — Search → [PROGRESS.md](../../PROGRESS.md#feature-09-search)

## Objective

Search products, ingredients, brands by query with filters and sort options.

## Requirements

- `GET /search` unified endpoint
- Filters: highest/lowest rated, newest, most popular
- Filter by category, subcategory
- Barcode exact match shortcut

## Subtasks

- [ ] `search` module: service with PostgreSQL `ILIKE` / full-text on product name, brand name, ingredient names
- [ ] Barcode: if `q` is numeric and length 8–14, try exact product match first
- [ ] Return typed results: `{ type, item }[]` or grouped `{ products, ingredients, brands }`
- [ ] Frontend: `features/search/`, `useSearch` with debounce
- [ ] `pages/search/index.tsx` — search input, filter chips, sort dropdown
- [ ] Result rows by type with navigation
- [ ] Empty and loading states

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — search field = `Input`; filter chips compose `Button variant="outline"` or add one `FilterChip` primitive in `components/ui/` if reused. Result rows use `Card` + `SafetyBadge`.

## Technical Notes

- Elasticsearch deferred — document in technical notes when adding at scale
- Paginate all result lists

## Acceptance Criteria

- [ ] Search "niacinamide" returns products and ingredients
- [ ] Sort by highest rated changes order
- [ ] Category filter narrows products
- [ ] Barcode search finds product directly
