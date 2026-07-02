# Task: OCR Integration & Product Creation Jobs

## Feature group

Feature 07 — New Product Creation (OCR + AI) → [PROGRESS.md](../../PROGRESS.md#feature-07-new-product-creation-ocr--ai)

## Objective

Backend pipeline: upload label images, OCR extraction, async job tracking.

## Requirements

- ProductCreationJob model
- GCS upload for ingredient + front label images
- OCR integration module extracting text from images
- Job status endpoint

## Subtasks

- [x] Add ProductCreationJob to Prisma + migration
- [x] Create `integrations/ocr/` module (Google Vision or Tesseract wrapper)
- [x] `product-creation` module: controller, service
- [x] `POST /product-creation/jobs` — create job (optional barcode)
- [x] `POST .../ingredient-label` — multipart upload → GCS → store URL
- [x] `POST .../front-label` — multipart upload
- [x] `POST .../analyze` — run OCR on both images, store `ocr_result` JSON (name, brand, ingredients[], claims[])
- [x] `GET /product-creation/jobs/:uuid` — status PENDING|OCR|ANALYZING|COMPLETED|FAILED
- [x] Parse ingredient list from OCR text (split on commas, handle INCI patterns)
- [x] Register OCR + product-creation in AppModule

## Technical Notes

- OCR failures → 422 with user-friendly message
- Do not create Product yet — that is task 02 (AI analysis)

## Acceptance Criteria

- [x] Upload two label images → job reaches OCR complete with parsed ingredients array (build verified; manual E2E when GCS + Vision configured)
- [x] Job status endpoint reflects progress
- [x] Images stored in GCS with retrievable URLs
