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

- [ ] `features/product-creation/` — services, hooks (`useCreateJob`, `useUploadLabel`, `useRunOcr`, `useStartAnalysis`, `useJobStatus`)
- [ ] `pages/scan/create/index.tsx` — stepper wizard
- [ ] Step 1: camera capture ingredient list (or file upload)
- [ ] Step 2: camera capture front label
- [ ] Step 3: progress UI polling `GET /product-creation/jobs/:uuid` every 2s (after `POST .../start-analysis` returns 202)
- [ ] On COMPLETED: navigate to product detail
- [ ] On FAILED: show error + retry option
- [ ] Routes: `Routes.scan.create`
- [ ] Wire scan tab 404 flow to this route

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — step CTAs use `Button` / `Button variant="scan"`; file inputs styled via shared patterns. Analysis step shows job status text + optional `Skeleton` preview — not `"Loading..."` or one-off spinner buttons.

## Technical Notes

- Show educational tips during analysis ("Analyzing 12 ingredients...")
- Compress images client-side before upload if large
- Flow: upload labels → `POST .../analyze` (OCR) → `POST .../start-analysis` (202) → poll until `COMPLETED`

## Acceptance Criteria

- [ ] Unknown barcode → user completes 2 captures → sees progress → lands on new product detail
- [ ] Ingredient label-only path works when no barcode
- [ ] Failed OCR shows clear error with retake photo option
- [ ] New product appears in scan history
