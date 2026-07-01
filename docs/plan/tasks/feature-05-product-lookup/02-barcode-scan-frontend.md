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

- [ ] Install barcode library (`@zxing/browser` or equivalent)
- [ ] `features/scan/` — `useBarcodeLookup` mutation, scan service
- [ ] `features/products/` — `useGetProductByBarcode`, `useRecordScan`
- [ ] `pages/scan/index.tsx` — camera viewfinder, permission handling, manual barcode entry fallback
- [ ] On success: `navigate(Routes.products.detail(uuid))`
- [ ] On 404: navigate to creation flow route with barcode query param
- [ ] Error states: camera denied, invalid barcode, network error
- [ ] Loading overlay during lookup

## Technical Notes

- HTTPS required for camera on mobile web
- Manual entry field for desktop dev without camera

## Acceptance Criteria

- [ ] Scan seeded product barcode → product detail page opens
- [ ] Scan unknown barcode → user sees creation flow entry (or placeholder with barcode preserved)
- [ ] Scan appears in history after successful lookup
- [ ] Camera permission denial shows helpful message + manual entry
