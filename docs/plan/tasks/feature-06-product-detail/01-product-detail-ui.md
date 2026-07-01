# Task: Product Detail Page UI

## Feature group

Feature 06 — Product Detail UI → [PROGRESS.md](../../PROGRESS.md#feature-06-product-detail-ui)

## Objective

Build the full Product Details page per spec: hero, score badge, summary, expandable ingredient accordions.

## Requirements

- Layout matches spec: hero image, name, brand, score, category
- Product Summary section (AI summary, benefits, risks, warnings)
- Large green "INGREDIENTS" header
- Accordion per ingredient: collapsed (color dot, name) → expanded (full analysis)
- Link ingredient name to ingredient detail page

## Subtasks

- [ ] `features/products/interfaces/products.interfaces.ts` — match API shape
- [ ] `useGetProduct(product_uuid)` hook
- [ ] `pages/products/detail/index.tsx` — ProductDetailPage
- [ ] `Route`: `Routes.products.detail` → `/products/:product_id`
- [ ] Components: `ProductHero`, `ProductScoreBadge`, `ProductSummary`, `IngredientAccordionList`
- [ ] `IngredientAccordion` — collapsed/expanded states, color from `color_indicator`
- [ ] Segmented control placeholder: "Analysis" | "AI Chat" (chat disabled/coming soon)
- [ ] Favorite button placeholder (wired in Feature 10)
- [ ] Share button (copy link) optional

## Technical Notes

- Use frontend-design skill — rounded cards, generous spacing, reference GreenPoint style
- Score color scale: map 0–20 to green→red bands per spec

## Acceptance Criteria

- [ ] Open product from scan or direct URL shows hero, score, and summary
- [ ] All ingredients listed in label order
- [ ] Expand ingredient shows risk explanation, benefits, pregnancy safety, etc.
- [ ] Tap ingredient navigates to ingredient detail page
- [ ] Responsive on mobile and desktop
