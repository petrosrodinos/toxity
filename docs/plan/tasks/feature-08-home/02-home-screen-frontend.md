# Task: Home Screen UI

## Feature group

Feature 08 — Home & Discovery → [PROGRESS.md](../../PROGRESS.md#feature-08-home--discovery)

## Objective

Build Home tab with product cards, category chips, ingredient spotlight, daily tip.

## Requirements

- Replace home placeholder with real data from `GET /home`
- Product card component reusable in History and Search
- Horizontal scroll sections where appropriate

## Subtasks

- [ ] `features/home/` — service, `useGetHomeFeed`
- [ ] `components/product-card.tsx` — thumbnail, name, brand, score badge, chevron
- [ ] `pages/home/index.tsx` — sections per spec
- [ ] Category chips → navigate to search filtered by category
- [ ] Ingredient spotlight card → ingredient detail
- [ ] Pull-to-refresh or refetch on focus (React Query `refetchOnWindowFocus`)
- [ ] Empty states per section
- [ ] Loading skeletons per section (card/row placeholders — never "Loading..." labels)

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — `ProductCard` must use `Card` + `SafetyBadge` internally; home sections use `Button` for CTAs. One shared `components/product-card.tsx` for Home, History, and Search. While `useGetHomeFeed` loads, show `Skeleton` blocks — not text spinners.

## Technical Notes

- Match spec: large rounded cards, score color badge, mobile-first

## Acceptance Criteria

- [ ] Home shows real products in trending, highest rated, new sections
- [ ] Tapping product card opens product detail
- [ ] Continue scanning shows user's recent scans
- [ ] Categories navigable
