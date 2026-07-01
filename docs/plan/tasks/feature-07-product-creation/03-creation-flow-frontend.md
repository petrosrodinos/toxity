# Task: Product Creation Flow UI

## Feature group

Feature 07 — New Product Creation (OCR + AI) → [PROGRESS.md](../../PROGRESS.md#feature-07-new-product-creation-ocr--ai)

## Objective

Multi-step UI: capture ingredient list → capture front label → progress → product detail.

## Requirements

- Entry from scan 404 with barcode prefilled
- Alternative entry: Scan tab "Scan label instead"
- Steps match spec: ingredient label photo, front label photo, analyzing spinner
- Poll job status until complete

## Subtasks

- [ ] `features/product-creation/` — services, hooks (`useCreateJob`, `useUploadLabel`, `useAnalyzeJob`, `useJobStatus`)
- [ ] `pages/scan/create/index.tsx` — stepper wizard
- [ ] Step 1: camera capture ingredient list (or file upload)
- [ ] Step 2: camera capture front label
- [ ] Step 3: progress UI polling `GET /product-creation/jobs/:uuid` every 2s
- [ ] On COMPLETED: navigate to product detail
- [ ] On FAILED: show error + retry option
- [ ] Routes: `Routes.scan.create`
- [ ] Wire scan tab 404 flow to this route

## Technical Notes

- Show educational tips during analysis ("Analyzing 12 ingredients...")
- Compress images client-side before upload if large

## Acceptance Criteria

- [ ] Unknown barcode → user completes 2 captures → sees progress → lands on new product detail
- [ ] Ingredient label-only path works when no barcode
- [ ] Failed OCR shows clear error with retake photo option
- [ ] New product appears in scan history
