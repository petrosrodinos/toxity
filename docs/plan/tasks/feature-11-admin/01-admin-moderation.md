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

- [ ] `admin` module: controllers per API design
- [ ] `GET /admin/products/pending` — verification_status PENDING
- [ ] `PATCH /admin/products/:uuid/verify` — approve/reject
- [ ] `POST /admin/products/merge` — `{ keep_uuid, merge_uuid }` reassign scans, ingredients, favorites
- [ ] Ingredient + brand merge similarly
- [ ] Category/subcategory admin CRUD
- [ ] `PATCH /admin/products/:uuid/feature`
- [ ] Frontend: `pages/admin/` — layout with nav, pending products table, merge tool (two UUID inputs)
- [ ] Guard: redirect non-admin users
- [ ] Add `Routes.admin` paths

## Technical Notes

- Merge must be transactional (`$transaction`)
- Log merge actions for audit (optional AdminAction table)

## Acceptance Criteria

- [ ] Admin logs in → accesses `/admin`
- [ ] Pending product can be approved → visible with APPROVED status
- [ ] Merge duplicate products → one remains, scans consolidated
- [ ] Non-admin receives 403
