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

- [x] `features/scans/` (pre-existing `useGetScans` reused — no separate `features/history/` needed)
- [x] `pages/history/index.tsx` — Previous/Next pagination
- [x] Reuse `ProductCard` with scan date prop (`subtitle`)
- [x] Empty state: CTA to Scan tab
- [x] Pull to refresh — skipped in favor of explicit Previous/Next controls (no native pull gesture in a web app; refetch happens automatically on page change)
- [x] Loading skeleton `ProductCard` rows (no "Loading..." text)

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — reuse shared `ProductCard` (`Card` + `SafetyBadge`); empty-state CTA = `Button variant="scan"`. Initial fetch shows skeleton cards, not loading labels.

## Acceptance Criteria

- [x] History shows all user scans newest first (build/type-check verified; manual E2E when DB available)
- [x] Tapping entry opens product detail
- [x] Empty history shows helpful CTA
