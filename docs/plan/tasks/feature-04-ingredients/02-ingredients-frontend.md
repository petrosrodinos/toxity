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

- [ ] `features/ingredients/` — interfaces, services, `useGetIngredient`
- [ ] `ApiRoutes.ingredients` in config
- [ ] `pages/ingredients/detail/index.tsx` — IngredientDetailPage
- [ ] Color indicator badge component (reuse for product detail later)
- [ ] Sections as collapsible cards or stacked layout
- [ ] Link from product ingredient accordion (stub link until Feature 06)
- [ ] Add route to `routes.ts`

## Technical Notes

- Use `cn()` and theme tokens for color bands (green → red → gray)
- Mobile-first typography

## Acceptance Criteria

- [ ] Navigate to `/ingredients/:uuid` shows full ingredient analysis from API
- [ ] Color indicator visually matches enum (green/yellow/orange/red/gray)
- [ ] Page readable on mobile and desktop
