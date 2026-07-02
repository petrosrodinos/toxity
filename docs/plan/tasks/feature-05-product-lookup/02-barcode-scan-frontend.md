# Task: Barcode Scan Screen (Existing Product Path)

## Feature group

Feature 05 — Product Lookup (Existing Product) → [PROGRESS.md](../../PROGRESS.md#feature-05-product-lookup-existing-product)

## Objective

Implement Scan tab: camera barcode scanning → lookup → navigate to product detail or start creation flow.

## Requirements

- Use browser camera API + barcode library
- Call barcode lookup API
- On 404: route to product creation flow (Feature 07 — show "Product not found" + CTA for now)
- On success: record scan + open product detail

## Subtasks

- [x] Install barcode library (`@zxing/browser` or equivalent)
- [x] `features/scan/` — `useBarcodeLookup` mutation, scan service
- [x] `features/products/` — `useGetProductByBarcode`, `useRecordScan`
- [x] `pages/scan/index.tsx` — camera viewfinder, permission handling, manual barcode entry fallback
- [x] On success: `navigate(Routes.products.detail(uuid))`
- [x] On 404: navigate to creation flow route with barcode query param
- [x] Error states: camera denied, invalid barcode, network error
- [x] Lookup pending state via `Button loading` on submit (not "Loading..." page text)

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — `Button variant="scan"` for primary actions; `Input` for manual barcode entry; lookup pending = `Button loading` on the scan/submit action. No duplicate CTA/input styles. No bare loading labels.

## Technical Notes

- HTTPS required for camera on mobile web
- Manual entry field for desktop dev without camera

## Acceptance Criteria

- [x] Scan seeded product barcode → product detail page opens
- [x] Scan unknown barcode → user sees creation flow entry (or placeholder with barcode preserved)
- [x] Scan appears in history after successful lookup
- [x] Camera permission denial shows helpful message + manual entry
