# Task: Scan History UI

## Feature group

Feature 10 — History & Favorites → [PROGRESS.md](../../PROGRESS.md#feature-10-history--favorites)

## Objective

History tab listing user's scanned products with spec layout.

## Requirements

- `GET /scans` paginated
- Card: image, name, brand, score, scan date
- Tap → product detail

## Subtasks

- [ ] `features/history/` — `useGetScanHistory`
- [ ] `pages/history/index.tsx` — infinite scroll or pagination
- [ ] Reuse `ProductCard` with scan date prop
- [ ] Empty state: CTA to Scan tab
- [ ] Pull to refresh

## Acceptance Criteria

- [ ] History shows all user scans newest first
- [ ] Tapping entry opens product detail
- [ ] Empty history shows helpful CTA
