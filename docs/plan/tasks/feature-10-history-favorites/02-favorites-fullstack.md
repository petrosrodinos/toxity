# Task: Favorites API & UI

## Feature group

Feature 10 — History & Favorites → [PROGRESS.md](../../PROGRESS.md#feature-10-history--favorites)

## Objective

Users can favorite products, ingredients, and brands; view and toggle from detail pages.

## Requirements

- UserFavorite model
- CRUD endpoints per API design
- `is_favorited` on product and ingredient detail responses
- Profile sub-section or tabs for favorites

## Subtasks

- [x] Add UserFavorite to Prisma + migration
- [x] `favorites` module: controller, service
- [x] `POST /favorites`, `DELETE /favorites/:uuid`, `GET /favorites`, `GET /favorites/check` (extended with `favorite_uuid` in the response so the frontend can toggle off without a second lookup)
- [x] Update product + ingredient detail services to include `is_favorited`
- [x] Frontend: `features/favorites/`, hooks with toast + invalidate
- [x] Heart toggle on product detail and ingredient detail (`components/favorite-toggle.tsx`)
- [x] Profile page tabs: Favorite Products | Ingredients | Brands (`FavoritesTabs`)
- [x] List views with navigation to detail
- [x] Loading skeleton list rows (no "Loading..." labels)

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — heart toggle = `Button variant="ghost"` + icon; favorite lists reuse `Card` / `ProductCard`. Profile tabs use existing layout primitives. Favorites fetch → skeleton cards.

## Acceptance Criteria

- [x] Favorite product from detail → appears in profile favorites (build/type-check verified; manual E2E when DB available)
- [x] Unfavorite removes from list
- [x] Favorite state persists across sessions (stored server-side in `user_favorites`)
- [x] Favorite ingredient and brand work similarly
