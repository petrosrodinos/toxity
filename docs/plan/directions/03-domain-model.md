# Domain Model — Toxity

> **Related:** [PRODUCT.md](../../PRODUCT.md) · [DESIGN.md](../../DESIGN.md) (safety `ColorIndicator` UI mapping)

## Entity relationship overview

```
Category 1──* Subcategory 1──* Product
Brand 1──* Product
Product *──* Ingredient (via ProductIngredient, ordered)
User 1──* UserProductScan *──1 Product
User 1──* UserFavorite (polymorphic: product | ingredient | brand)
Product 1──* ProductAnalysisVersion
Ingredient 1──* IngredientAnalysisVersion
Product 1──* ProductImage
```

## Global entities

### Category

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| name | string | unique, indexed |
| slug | string | unique |
| icon_url | string? | |
| sort_order | int | default 0 |
| created_at | datetime | |
| updated_at | datetime | |

### Subcategory

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| category_uuid | UUID | FK → Category |
| name | string | unique per category |
| slug | string | |
| sort_order | int | |
| created_at / updated_at | datetime | |

**Constraint:** `@@unique([category_uuid, name])`

### Brand

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| name | string | unique, indexed |
| slug | string | unique |
| logo_url | string? | |
| website | string? | |
| country | string? | |
| description | text? | |
| created_at / updated_at | datetime | |

### Ingredient

Global — one row per distinct ingredient.

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| name | string | unique, indexed |
| synonyms | string[] | |
| scientific_name | string? | |
| description | text? | |
| ai_summary | text? | |
| full_description | text? | |
| benefits | text? | |
| risks | text? | |
| safety_explanation | text? | |
| purpose | text? | |
| common_uses | text? | |
| pregnancy_safety | enum? | SAFE / CAUTION / AVOID / UNKNOWN |
| child_safety | enum? | |
| allergy_risk | text? | |
| carcinogenic_evidence | text? | |
| hormone_disruption_risk | text? | |
| irritation_risk | text? | |
| acne_rating | int? | |
| comedogenic_rating | int? | |
| sensitive_skin_suitability | enum? | |
| environmental_impact | text? | |
| is_vegan | boolean? | |
| is_cruelty_free | boolean? | |
| is_biodegradable | boolean? | |
| overall_score | decimal? | |
| safety_score | decimal? | |
| risk_score | decimal? | |
| confidence_score | decimal? | |
| color_indicator | enum | VERY_SAFE … UNKNOWN |
| research_summary | text? | |
| references | json? | array of { title, url } |
| ai_version | string? | |
| created_at / updated_at | datetime | |

### Product

Global — one row per product.

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| barcode | string? | unique when not null |
| name | string | indexed |
| brand_uuid | UUID | FK → Brand |
| subcategory_uuid | UUID | FK → Subcategory |
| description | text? | |
| ai_summary | text? | |
| benefits | text? | |
| risks | text? | |
| warnings | text? | |
| suitability | text? | |
| recommended_usage | text? | |
| storage_info | text? | |
| pregnancy_safety | enum? | |
| children_safety | enum? | |
| sensitive_skin_safety | enum? | |
| allergy_warnings | text? | |
| environmental_impact | text? | |
| is_vegan | boolean? | |
| is_cruelty_free | boolean? | |
| overall_score | decimal | 0–20 |
| color_indicator | enum | score band |
| scientific_confidence | decimal? | |
| marketing_claims | string[] | organic, vegan, etc. |
| package_size | string? | |
| verification_status | enum | PENDING / APPROVED / REJECTED |
| is_featured | boolean | default false |
| scan_count | int | default 0, denormalized |
| ai_version | string? | |
| faq | json? | array of { question, answer } |
| alternative_product_uuids | uuid[] | |
| similar_product_uuids | uuid[] | |
| created_at / updated_at | datetime | |

### ProductIngredient (join)

| Field | Type | Constraints |
|-------|------|-------------|
| product_uuid | UUID | FK |
| ingredient_uuid | UUID | FK |
| position | int | ingredient order on label |
| @@unique([product_uuid, ingredient_uuid]) | | |
| @@unique([product_uuid, position]) | | |

### ProductImage

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| product_uuid | UUID | FK |
| url | string | |
| type | enum | HERO / PACKAGE / INGREDIENT_LABEL / FRONT_LABEL |
| sort_order | int | |

### ProductAnalysisVersion / IngredientAnalysisVersion

Audit trail for admin reanalysis.

| Field | Type |
|-------|------|
| uuid | UUID PK |
| product_uuid or ingredient_uuid | FK |
| snapshot | json | full analysis at point in time |
| ai_version | string |
| triggered_by_user_uuid | UUID? |
| created_at | datetime |

## User-scoped entities

### User (extend existing)

Add to existing `User` model:

| Field | Type |
|-------|------|
| name | string? |

### PasswordResetToken

Short-lived reset flow only (hashed token, `expires_at`, `user_uuid`). No refresh tokens — sessions use JWT access token only.

### UserProductScan

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| user_uuid | UUID | FK |
| product_uuid | UUID | FK |
| scanned_at | datetime | |
| scan_method | enum | BARCODE / OCR |
| @@unique([user_uuid, product_uuid]) | | one history row per user+product |

### UserFavorite

| Field | Type | Constraints |
|-------|------|-------------|
| uuid | UUID | PK |
| user_uuid | UUID | FK |
| entity_type | enum | PRODUCT / INGREDIENT / BRAND |
| entity_uuid | UUID | |
| created_at | datetime | |
| @@unique([user_uuid, entity_type, entity_uuid]) | | |

## Enums

```ts
ColorIndicator: VERY_SAFE | SAFE | MODERATE | CAUTION | HIGH_RISK | UNKNOWN
VerificationStatus: PENDING | APPROVED | REJECTED
ScanMethod: BARCODE | OCR
FavoriteEntityType: PRODUCT | INGREDIENT | BRAND
SafetyLevel: SAFE | CAUTION | AVOID | UNKNOWN
ProductImageType: HERO | PACKAGE | INGREDIENT_LABEL | FRONT_LABEL
```

`Theme` (LIGHT / DARK / SYSTEM) is a frontend-only preference — not stored on `User`.

## Product creation job (transient)

### ProductCreationJob

| Field | Type |
|-------|------|
| uuid | UUID |
| user_uuid | UUID |
| status | enum PENDING / OCR / ANALYZING / COMPLETED / FAILED |
| barcode | string? |
| ingredient_label_image_url | string? |
| front_label_image_url | string? |
| ocr_result | json? |
| product_uuid | UUID? | set on success |
| error_message | text? |
| created_at / updated_at | datetime |

## Indexes (critical)

- `Product.barcode` — unique partial index
- `Product.name` + `Product.brand_uuid` — composite for dedup
- `Ingredient.name` — unique
- `UserProductScan(user_uuid, scanned_at DESC)` — history list
- `Product(overall_score DESC)`, `Product(created_at DESC)`, `Product(scan_count DESC)` — home feeds

## Seed data

- Initial categories/subcategories per spec (Beauty, Healthcare, Food, Supplements, Cleaning, Pet Care, Baby)
- No seed products required — created via scan flow
