# Task: Product Creation Flow UI

## Feature group

Feature 07 — New Product Creation (OCR + AI) → [PROGRESS.md](../../PROGRESS.md#feature-07-new-product-creation-ocr--ai)

## Objective

Multi-step UI: capture ingredient list → capture front label → progress → product detail.

## Requirements

- Entry from scan 404 with barcode prefilled
- Alternative entry: Scan tab "Scan label instead"
- Steps match spec: ingredient label photo, front label photo, analyzing progress (named step labels — not generic "Loading...")
- Poll job status until complete

## Subtasks

- [x] `features/product-creation/` — services (`product-creation.services.ts`), hooks (`useCreateProductCreationJob`, `useUploadIngredientLabel`, `useUploadFrontLabel`, `useAnalyzeProductCreationJob`, `useStartProductAnalysis`, `useProductCreationJob`)
- [x] `pages/products/create/index.tsx` — stepper wizard (route already existed as `Routes.products.create`, reused instead of adding a duplicate `Routes.scan.create`)
- [x] Step 1: camera capture ingredient list (`capture="environment"` file input, falls back to file browser on desktop)
- [x] Step 2: camera capture front label
- [x] Step 3: progress UI polling `GET /product-creation/jobs/:uuid` every 2s (after `POST .../start-analysis` returns 202)
- [x] On COMPLETED: navigate to product detail
- [x] On FAILED: show error + retry option (creates a fresh job, since the backend only allows label uploads while a job is PENDING)
- [x] Routes: reused existing `Routes.products.create` / `Routes.products.create_with_barcode`
- [x] Wire scan tab 404 flow to this route (already wired via `useBarcodeLookup`) + added "Scan label instead" entry point on the Scan tab

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — step CTAs use `Button` / `Button variant="scan"`; file inputs styled via shared patterns. Analysis step shows job status text + optional `Skeleton` preview — not `"Loading..."` or one-off spinner buttons.

## Technical Notes

- Show educational tips during analysis ("Analyzing 12 ingredients...")
- Compress images client-side before upload if large
- Flow: upload labels → `POST .../analyze` (OCR) → `POST .../start-analysis` (202) → poll until `COMPLETED`

## Acceptance Criteria

- [x] Unknown barcode → user completes 2 captures → sees progress → lands on new product detail (build-verified via `tsc -b && vite build`; no live browser/E2E run — no backend credentials available in this environment and interactive browser testing was declined by the user)
- [x] Ingredient label-only path works when no barcode (`Routes.products.create` with no `barcode` param; "Scan label instead" entry point added to Scan tab)
- [x] Failed OCR shows clear error with retake photo option (`CreationErrorState` + `start_over`)
- [x] New product appears in scan history (`ProductAnalysisRunner` creates the `UserProductScan` row; wizard invalidates the `scans` and `products` query keys on completion)
