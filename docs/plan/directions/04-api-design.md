# API Design — Toxity

> **Related:** [PRODUCT.md](../../PRODUCT.md) · [DESIGN.md](../../DESIGN.md) · [05-frontend-ui-primitives.md](./05-frontend-ui-primitives.md) (frontend: reuse `components/ui/`)

Base path: `/api` (or root per existing config). All authenticated routes use `Authorization: Bearer <token>`.

## Auth (`/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/email/register` | Public | Register |
| POST | `/auth/email/login` | Public | Login — returns JWT `access_token` + `expires_in` |
| POST | `/auth/email/forgot-password` | Public | Send reset email |
| POST | `/auth/email/reset-password` | Public | Reset with token |

**Auth response (register/login):**

```json
{
  "access_token": "...",
  "expires_in": 1719859200,
  "user": { "uuid", "email", "name", "role", "created_at", "updated_at" }
}
```

No refresh token — client re-authenticates when JWT expires.

## Users (`/users`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/users/me` | JWT | Current user profile |
| PATCH | `/users/me` | JWT | Update `name` |

## Products (`/products`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/products/barcode/:barcode` | JWT | Lookup by barcode; 404 if not found |
| GET | `/products/:uuid` | JWT | Full product detail + ingredients ordered |
| GET | `/products` | JWT | List with query: category, subcategory, brand, featured, sort |
| GET | `/products/:uuid/similar` | JWT | Similar / alternative products |

**Product detail response shape:**

```json
{
  "uuid": "...",
  "name": "...",
  "brand": { "uuid", "name", "logo_url" },
  "subcategory": { "uuid", "name", "category": { "uuid", "name" } },
  "overall_score": 18.4,
  "color_indicator": "EXCELLENT",
  "images": [...],
  "ai_summary": "...",
  "benefits": "...",
  "risks": "...",
  "warnings": "...",
  "ingredients": [
    {
      "position": 1,
      "ingredient": { /* full ingredient analysis */ }
    }
  ],
  "faq": [...],
  "is_favorited": false
}
```

## Product creation (`/product-creation`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/product-creation/jobs` | JWT | Start job (barcode optional, images multipart) |
| GET | `/product-creation/jobs/:uuid` | JWT | Job status + product_uuid when done |
| POST | `/product-creation/jobs/:uuid/ingredient-label` | JWT | Upload ingredient list image (step 1) |
| POST | `/product-creation/jobs/:uuid/front-label` | JWT | Upload front label image (step 2) |
| POST | `/product-creation/jobs/:uuid/analyze` | JWT | Trigger OCR + AI pipeline |

## Scans (`/scans`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/scans` | JWT | Record scan `{ product_uuid, scan_method }` |
| GET | `/scans` | JWT | User history (paginated, product summary) |
| GET | `/scans/recent` | JWT | Last N for home "Continue scanning" |

## Ingredients (`/ingredients`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/ingredients/:uuid` | JWT | Full ingredient detail |
| GET | `/ingredients` | JWT | List/search `?search=&color_indicator=` |

## Brands (`/brands`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/brands/:uuid` | JWT | Brand detail + product count |
| GET | `/brands` | JWT | List/search paginated |

## Categories (`/categories`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/categories` | JWT | Tree: categories with subcategories |
| GET | `/categories/:uuid/products` | JWT | Products in category (paginated) |

## Search (`/search`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/search` | JWT | Unified search |

**Query params:** `q`, `type` (product|ingredient|brand|barcode), `category_uuid`, `subcategory_uuid`, `sort` (highest_rated|lowest_rated|newest|most_popular), `page`, `limit`

## Home (`/home`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/home` | JWT | Aggregated feed sections |

**Response sections:**

```json
{
  "continue_scanning": [...],
  "recently_scanned": [...],
  "trending": [...],
  "highest_rated": [...],
  "new_products": [...],
  "recommended": [...],
  "categories": [...],
  "ingredient_spotlight": { "ingredient": {...} },
  "daily_tip": { "title", "body" }
}
```

## Favorites (`/favorites`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/favorites` | JWT | `?type=product|ingredient|brand` |
| POST | `/favorites` | JWT | `{ entity_type, entity_uuid }` |
| DELETE | `/favorites/:uuid` | JWT | Remove favorite |
| GET | `/favorites/check` | JWT | `?entity_type=&entity_uuid=` → boolean |

## Admin (`/admin`) — RolesGuard ADMIN+

| Method | Path | Description |
|--------|------|-------------|
| GET | `/admin/products/pending` | Products awaiting review |
| PATCH | `/admin/products/:uuid/verify` | Approve/reject |
| POST | `/admin/products/merge` | Merge duplicate products |
| POST | `/admin/ingredients/merge` | Merge duplicate ingredients |
| POST | `/admin/brands/merge` | Merge duplicate brands |
| CRUD | `/admin/categories` | Manage taxonomy |
| CRUD | `/admin/subcategories` | Manage taxonomy |
| POST | `/admin/products/:uuid/reanalyze` | Queue AI reanalysis |
| POST | `/admin/ingredients/:uuid/reanalyze` | Queue ingredient reanalysis |
| PATCH | `/admin/products/:uuid/feature` | Toggle featured |
| GET | `/admin/products/:uuid/versions` | Analysis version history |

## Pagination standard

All list endpoints return:

```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "total_pages": 5,
    "has_next": true,
    "has_prev": false
  }
}
```

## Error codes

| HTTP | When |
|------|------|
| 404 | Product barcode not found (triggers creation flow on client) |
| 409 | Duplicate favorite, duplicate scan noop |
| 422 | OCR failed / AI could not parse ingredients |
| 202 | Product creation job accepted (async) |

## Webhooks / realtime (optional slice)

- `GET /product-creation/jobs/:uuid/stream` — SSE for job progress
- Or WebSocket event `product.creation.completed`
