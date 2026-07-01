# Product Specification — Toxity

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

- Mobile Web (primary)
- Desktop Web (responsive)
- Android (future — same API + responsive/PWA shell first)

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
