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

- [x] `search` module: service with PostgreSQL `contains`/insensitive match on product name, brand name, ingredient names
- [x] Barcode: if `q` is numeric and length 8–14, try exact product match first
- [x] Return typed results: grouped `{ products, ingredients, brands }`, each independently paginated
- [x] Frontend: `features/search/`, `useSearch` with debounce (`useDebouncedValue`)
- [x] `pages/search/index.tsx` — search input, All/Products/Ingredients/Brands tabs, sort dropdown
- [x] Result rows by type with navigation
- [x] Empty state with helpful copy
- [x] Loading skeleton result rows (debounced search — no "Loading..." label)

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — search field = `Input`; filter chips compose `Button variant="outline"` or add one `FilterChip` primitive in `components/ui/` if reused. Result rows use `Card` + `SafetyBadge`. While `useSearch` fetches, show skeleton cards — never bare loading text.

## Technical Notes

- Elasticsearch deferred — document in technical notes when adding at scale
- Paginate all result lists

## Acceptance Criteria

- [x] Search "niacinamide" returns products and ingredients (build/type-check verified; manual E2E when DB available)
- [x] Sort by highest rated changes order
- [x] Category filter narrows products (via `?category_uuid=` from Home category chips)
- [x] Barcode search finds product directly
