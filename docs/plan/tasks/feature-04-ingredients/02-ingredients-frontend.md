# Task: Ingredient Detail Page (Frontend)

## Feature group

Feature 04 — Ingredient Library → [PROGRESS.md](../../PROGRESS.md#feature-04-ingredient-library)

## Objective

Build ingredient detail screen with safety color, scores, and educational sections.

## Requirements

- Route: `/ingredients/:uuid`
- Feature module: services, hooks, interfaces
- Match spec sections: General, AI Analysis, Health, Cosmetic, Sustainability, Scientific

## Subtasks

- [x] `features/ingredients/` — interfaces, services, `useGetIngredient`
- [x] `ApiRoutes.ingredients` in config
- [x] `pages/ingredients/detail/index.tsx` — IngredientDetailPage
- [x] `SafetyBadge` from `components/ui/safety-badge.tsx` (do not build a one-off badge)
- [x] Sections as collapsible cards or stacked layout
- [x] Link from product ingredient accordion (stub link until Feature 06) — `IngredientLink` component
- [x] Add route to `routes.ts`

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — use `SafetyBadge` for color indicator; `Card` for section blocks. Do not recreate badge or card styles inline.

## Technical Notes

- Use `cn()` and theme tokens for color bands (green → red → gray)
- Mobile-first typography

## Acceptance Criteria

- [x] Navigate to `/ingredients/:uuid` shows full ingredient analysis from API
- [x] Color indicator visually matches enum (green/yellow/orange/red/gray)
- [x] Page readable on mobile and desktop
