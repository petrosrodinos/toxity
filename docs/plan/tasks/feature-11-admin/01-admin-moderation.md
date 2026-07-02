# Task: Admin Moderation Panel

## Feature group

Feature 11 — Admin Panel → [PROGRESS.md](../../PROGRESS.md#feature-11-admin-panel)

## Objective

Admin routes for product review, taxonomy CRUD, merge duplicates, feature products.

## Requirements

- Role-gated routes (ADMIN, SUPER_ADMIN)
- Web UI at `/admin` (basic, functional)
- Merge products/ingredients/brands

## Subtasks

- [x] `admin` module: controllers per API design
- [x] `GET /admin/products/pending` — verification_status PENDING
- [x] `PATCH /admin/products/:uuid/verify` — approve/reject
- [x] `POST /admin/products/merge` — `{ keep_uuid, merge_uuid }` reassign scans, favorites (product_ingredients/images cascade-delete with the removed duplicate)
- [x] Ingredient + brand merge similarly
- [x] Category/subcategory admin CRUD
- [x] `PATCH /admin/products/:uuid/feature`
- [x] Frontend: `pages/admin/` — tabbed layout, pending products table, merge tool (two UUID inputs per entity type)
- [x] Guard: redirect non-admin users (`ProtectedRoute requiredRoles=[ADMIN]`)
- [x] Add `Routes.admin` paths

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — admin tables and forms use `Input`, `Button`, `Card`; no separate admin-only button styles.

## Technical Notes

- Merge must be transactional (`$transaction`)
- Log merge actions for audit (optional AdminAction table)

## Acceptance Criteria

- [x] Admin logs in → accesses `/admin` (build/type-check verified; manual E2E when DB available)
- [x] Pending product can be approved → visible with APPROVED status
- [x] Merge duplicate products → one remains, scans consolidated
- [x] Non-admin receives 403 (`RolesGuard` returns `false` → Nest's default `ForbiddenException`)
