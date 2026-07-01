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

- [ ] Add UserFavorite to Prisma + migration
- [ ] `favorites` module: controller, service
- [ ] `POST /favorites`, `DELETE /favorites/:uuid`, `GET /favorites`, `GET /favorites/check`
- [ ] Update product + ingredient detail services to include `is_favorited`
- [ ] Frontend: `features/favorites/`, hooks with toast + invalidate
- [ ] Heart toggle on product detail and ingredient detail
- [ ] Profile page tabs: Favorite Products | Ingredients | Brands
- [ ] List views with navigation to detail

## Acceptance Criteria

- [ ] Favorite product from detail → appears in profile favorites
- [ ] Unfavorite removes from list
- [ ] Favorite state persists across sessions
- [ ] Favorite ingredient and brand work similarly
