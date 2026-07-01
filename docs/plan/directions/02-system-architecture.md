# System Architecture — Toxity

> **Related:** [PRODUCT.md](../../PRODUCT.md) · [DESIGN.md](../../DESIGN.md) — **mobile-first app** with **bottom navigation** (`components/layout/bottom-nav.tsx`, `app-shell.tsx`)

## Frontend stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | React 19 + TypeScript | Existing `app/` |
| Build | Vite 8 | Existing |
| Routing | React Router 7 | Centralized `Routes` object |
| Server state | TanStack Query | Feature hooks in `features/` |
| Client state | Zustand (persist) | Auth, theme, preferences |
| Forms | React Hook Form + Zod | |
| Styling | Tailwind CSS v4 | Mobile-first, CSS variables |
| UI | shadcn/ui primitives | Extend via wrappers |
| Barcode | `@zxing/browser` or `html5-qrcode` | Camera barcode on web |
| OCR | Client capture → API upload | Server-side OCR (Google Vision / Tesseract via integration) |

## Backend stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | NestJS 11 | Existing `api/` |
| ORM | Prisma 7 + PostgreSQL | |
| Auth | JWT (Passport) | Extend existing `auth` module |
| Validation | class-validator (body), Zod (query) | Per project rules |
| Queue | BullMQ + Redis | AI analysis jobs (async) |
| Cache | Redis | Product lookup, home feeds |
| AI | OpenAI via `integrations/ai` | Structured JSON outputs |
| OCR | Google Cloud Vision or similar | `integrations/` wrapper |
| Storage | GCS (existing integration) | Product/label images |
| Search | PostgreSQL full-text initially; Elasticsearch later | Phase after MVP search |
| Docs | Swagger | |

## External services

| Service | Use |
|---------|-----|
| PostgreSQL | Primary data store |
| Redis | Cache, job queues |
| OpenAI | Product & ingredient AI analysis |
| Google Cloud Vision (or equivalent) | OCR on label images |
| Google Cloud Storage | Image storage |
| SendGrid / Resend | Email verification, password reset |
| (Future) Elasticsearch | Advanced search at scale |

## Auth system

- Email + password registration with bcrypt (existing)
- JWT access token; refresh token in DB or httpOnly cookie
- Email verification token flow
- Password reset token flow
- `JwtGuard` on all user-specific routes; `RolesGuard` for ADMIN routes
- User profile: name, avatar URL, country, preferred_language, theme, notification_settings (JSON)

## Deployment approach

| Environment | Config |
|-------------|--------|
| Local | `.env.local` |
| Staging | `.env.staging` (user already runs `start:staging`) |
| Production | `.env.production` |

- API: containerized NestJS (existing patterns)
- App: static build served via CDN or same origin reverse proxy
- DB migrations via Prisma migrate
- Background workers: same image, separate process for BullMQ consumers

## Folder / module structure

### API (`api/src/`)

```
modules/
├── auth/                    # Extend: verify, reset, refresh, profile
├── users/                   # Profile CRUD, avatar upload
├── products/                # Global products, barcode lookup, detail
├── ingredients/             # Global ingredients, detail, search
├── brands/                  # Brand CRUD + list
├── categories/              # Category + subcategory hierarchy
├── scans/                   # User scan history
├── favorites/               # User favorites (products, ingredients, brands)
├── search/                  # Unified search endpoint
├── home/                    # Home feed aggregations
├── product-creation/        # OCR upload, AI pipeline orchestration
├── admin/                   # Moderation, merge, reanalysis triggers
└── internal/
    ├── ai/                  # AI facade (existing scaffold)
    ├── mail/
    └── redis-cache/

integrations/
├── ai/                      # OpenAI structured prompts
├── ocr/                     # NEW: vision OCR wrapper
└── storage/                 # GCS image upload (existing)

background/
├── processors/
│   ├── product-analysis.processor.ts
│   └── ingredient-analysis.processor.ts
└── cron/                    # Optional: stale product reanalysis
```

### App (`app/src/`)

```
features/
├── auth/                    # Extend existing
├── user/                    # Profile, settings
├── products/                # Product detail, cards
├── ingredients/             # Ingredient detail
├── scan/                    # Barcode + OCR capture flow
├── search/                  # Search + filters
├── history/                 # Scan history
├── favorites/               # Favorites
├── home/                    # Home feed sections
├── categories/              # Category browsing
└── admin/                   # Admin screens (role-gated)

pages/
├── home/
├── scan/
├── search/
├── history/
├── profile/
├── products/[id]/
├── ingredients/[id]/
└── admin/

components/layout/
├── bottom-nav.tsx           # Home | Scan | Search | History | Profile
└── app-shell.tsx            # Mobile-first shell
```

## Key architectural decisions

1. **Global vs user data** — Products, ingredients, brands, categories are global. `UserProductScan`, `UserFavorite` are per-user references only.
2. **No duplicate products** — Barcode is unique (when present). AI creation checks name+brand fuzzy match before insert.
3. **AI jobs are async** — New product flow returns job ID; client polls or uses WebSocket for completion; show progress UI.
4. **Ingredient reuse** — AI pipeline receives existing ingredient names/IDs; matches before creating new `Ingredient` rows.
5. **Version history** — `ProductAnalysisVersion`, `IngredientAnalysisVersion` tables for admin reanalysis audit trail.
6. **Scoring** — Store numeric scores (0–20 product, per-ingredient subscores) + derived `color_indicator` enum for UI.
7. **Replace CRM placeholder** — Remove dashboard lead metrics; repurpose routes for consumer app navigation.

## Reuse from existing codebase

| Existing | Action |
|----------|--------|
| `auth` module (register/login) | Extend with verify, reset, refresh |
| JWT guards, `CurrentUser` decorator | Keep |
| Prisma module | Extend schema |
| `integrations/ai` | Wire to product/ingredient prompts |
| `integrations/storage/gcs` | Product images |
| Internal mail module | Verification emails |
| Dashboard page | Replace with Home or redirect to `/home` |
| CRM sidebar | Replace with bottom navigation |
