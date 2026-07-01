# Product Specification — Toxity

> **Planning summary** — expanded canonical docs:
> - [PRODUCT.md](../../PRODUCT.md) — full product requirements document (PRD)
> - [DESIGN.md](../../DESIGN.md) — UI/UX and design system
> - [05-frontend-ui-primitives.md](./05-frontend-ui-primitives.md) — **reuse** shared `components/ui/` primitives (do not recreate per page)

## Product name

**Toxity** — AI-Powered Product Ingredient Intelligence Platform

## Purpose

Enable consumers to scan packaged products (cosmetics, food, supplements, cleaning, pet, baby, healthcare, etc.), understand every ingredient through AI-generated analysis, and make safer purchasing decisions. Users contribute to a shared global product database; each product is analyzed once and reused by everyone.

## Target users

- Health-conscious consumers researching product safety
- Parents checking baby/children product ingredients
- People with allergies, sensitive skin, or dietary restrictions
- Vegan/cruelty-free shoppers
- Anyone scanning barcodes or ingredient labels in-store or at home

## Core value proposition

Unlike simple safety-score apps, Toxity provides **comprehensive AI insights** per product and per ingredient: benefits, risks, suitability (pregnancy, children, sensitive skin), environmental impact, alternatives, and educational content — all backed by a **single global product record** that improves over time.

## Key features (MVP scope)

| Area | Capability |
|------|------------|
| Auth | Email register/login, forgot password, email verification, user profile |
| Scan | Barcode scan → existing product lookup; OCR label capture for new products |
| Products | Global product DB (one record per product), AI analysis, overall score |
| Ingredients | Global ingredient DB (one record per ingredient), per-ingredient AI analysis & color rating |
| Taxonomy | Category → Subcategory hierarchy; brand database |
| Discovery | Home feed (recent, trending, top-rated, categories, spotlight) |
| Search | By barcode, name, brand, ingredient, category; filters |
| History | User scan history (references global products) |
| Favorites | Favorite products, ingredients, brands |
| Admin | Review/approve products, merge duplicates, manage taxonomy, trigger AI reanalysis |

## Platforms

- **Mobile Web (primary)** — mobile-first UI with **fixed bottom navigation** (Home, Scan, Search, History, Profile)
- Desktop Web (responsive) — same five destinations; bottom nav hidden at `lg+`, adaptive side/top nav
- Android (future — same API + responsive/PWA shell first)

## Mobile app shell

| Bottom nav tab | Purpose |
|----------------|---------|
| Home | Discovery feed |
| Scan | Barcode scan + OCR product creation |
| Search | Products, ingredients, brands |
| History | Scan history |
| Profile | Account, settings, favorites |

Canonical detail: [DESIGN.md](../../DESIGN.md) §5.4 · Implementation: `tasks/feature-02-app-shell/01-app-shell-navigation.md`

## Out of scope for initial slices (future)

- Product reviews & community ratings
- Ingredient discussions
- Report incorrect information / suggest edits (community)
- Native Android app (ship web first)
- AI Chat on product detail (segmented control placeholder OK)

## Success criteria (MVP)

1. User registers, verifies email, logs in, sets profile preferences.
2. User scans a known barcode → sees full product detail with ingredient accordions.
3. User scans unknown barcode → captures label images → AI creates product → detail page opens.
4. User sees scan history, favorites, and home discovery feeds from real data.
5. Admin can review, merge duplicates, and re-trigger AI analysis.
