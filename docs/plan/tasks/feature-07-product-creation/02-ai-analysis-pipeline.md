# Task: AI Product Analysis Pipeline

## Feature group

Feature 07 — New Product Creation (OCR + AI) → [PROGRESS.md](../../PROGRESS.md#feature-07-new-product-creation-ocr--ai)

## Objective

AI analyzes OCR output, reuses existing taxonomy/ingredients, creates Product + Ingredients, computes scores.

## Requirements

- BullMQ job triggered after OCR
- AI prompt receives: product name, brand, ingredients, existing categories/subcategories/brands/ingredient names
- Reuse matches; create new only when needed
- Generate full product analysis per spec
- Per-ingredient analysis for new ingredients
- Overall product score 0–20 + color_indicator

## Subtasks

- [ ] `background/processors/product-analysis.processor.ts`
- [ ] AI prompt templates in `integrations/ai/prompts/product-analysis.ts`
- [ ] Structured JSON schema for AI response (Zod validate)
- [ ] Service logic: match brand by name, match ingredients fuzzy, match category/subcategory
- [ ] Create/update Ingredient records with AI fields
- [ ] Create Product + ProductIngredient rows + ProductImage from uploads
- [ ] Set job status COMPLETED + product_uuid
- [ ] Create UserProductScan for requesting user
- [ ] On failure: job FAILED + error_message
- [ ] Wire `POST .../analyze` to enqueue BullMQ job (return 202)

## Technical Notes

- Store `ai_version` on product and ingredients
- Default verification_status PENDING until admin approves (or APPROVED for MVP speed — document choice in code comment)
- IngredientAnalysisVersion snapshot on create

## Acceptance Criteria

- [ ] End-to-end: OCR job → AI job → new Product in DB with scores and ingredient links
- [ ] Existing ingredient "Glycerin" reused, not duplicated
- [ ] Existing category "Beauty" / subcategory "Moisturizers" reused when AI picks them
- [ ] User can poll job status and receive product_uuid
- [ ] Product detail API returns complete analysis for new product
