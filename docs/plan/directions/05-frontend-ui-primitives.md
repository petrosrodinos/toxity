# Frontend UI Primitives — Toxity

> **Related:** [DESIGN.md](../../DESIGN.md) §5.5 · [02-system-architecture.md](./02-system-architecture.md) · App rules: `app/.cursor/rules/main.mdc`

## Rule (required)

**Reuse shared UI primitives — do not recreate them per page.**

- Import controls from `app/src/components/ui/` (and layout from `components/layout/`).
- **Never** copy-paste the same Tailwind class strings for buttons, inputs, cards, or badges into page or feature files.
- Page-local components (`pages/**/components/`, `components/product-card.tsx`, etc.) **compose** primitives; they do not redefine base styles.
- Add a **new** file under `components/ui/` only when a pattern is needed in **two or more** features and does not fit an existing primitive.

Visual tokens live in `app/src/index.css` — use theme classes (`bg-accent`, `text-danger`, `border-border`, etc.), not hardcoded hex.

---

## Existing primitives (`app/src/components/ui/`)

| Import | File | Use for |
|--------|------|---------|
| `Button` | `button.tsx` | All actions. Variants: `default`, `outline`, `ghost`, **`scan`** (primary scan CTA) |
| `Input` | `input.tsx` | Text fields, search boxes, form inputs |
| `PasswordInput` | `password-input.tsx` | Password fields with show/hide toggle |
| `Card` | `card.tsx` | Section containers, list items, feed cards |
| `SafetyBadge` | `safety-badge.tsx` | Product/ingredient score bands (`compact` for inline lists) |
| `Skeleton` | `skeleton.tsx` | Placeholder blocks while data loads (lists, cards, detail pages) |
| `ActionButtonWithPending` | `action-button-with-pending.tsx` | Submit actions with built-in loading state |
| `Drawer` | `drawer.tsx` | Mobile sheets / slide-over panels |
| `Popover` | `popover.tsx` | Menus, user menu, anchored overlays |
| `toast` / `useToast` | `toast.tsx` | Mutation feedback (success + error) |

### Layout & brand (not in `ui/` but shared)

| Import | File | Use for |
|--------|------|---------|
| `BrandMark` | `components/brand/brand-mark.tsx` | Logo + wordmark |
| `Navbar`, `AppShell`, `BottomNav` | `components/layout/*` | Shell chrome (Feature 02) |

Full component catalog and variant guide: [DESIGN.md](../../DESIGN.md) §5.5.

---

## Forms

Use **React Hook Form + `zodResolver`** with primitives — same pattern as auth pages:

```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

<label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
<Input id="name" {...register("name")} />
{errors.name && <p className="text-sm text-danger">{errors.name.message}</p>}
<Button type="submit" loading={isSubmitting}>Save</Button>
```

Do **not** add raw `<button className="rounded-xl bg-accent ...">` or `<input className="...">` when `Button` / `Input` already exist.

---

## Loading states

Use **skeleton placeholders** for any async data fetch (pages, lists, cards, detail sections). **Never** show bare text like `"Loading..."`, `"Loading profile…"`, or a centered spinner as the primary page indicator.

| Context | Pattern |
|---------|---------|
| Page / list / card data (`useQuery` `isLoading`) | `<Skeleton>` blocks that mirror the final layout (same heights, grid, card count) |
| Home feed, search results, history | Skeleton rows/cards — not a single loading label |
| Product / ingredient detail | Page-local skeleton component (e.g. `ProductDetailLoading`) |
| Form submit / mutation | `Button loading={isSubmitting}` or `ActionButtonWithPending` — spinner on the button only |
| OCR / AI job progress | Step labels with real status text (e.g. "Analyzing 12 ingredients…") — not generic "Loading" |

Skeleton styling: `animate-pulse` + `bg-surface-secondary` + `rounded-xl` (or `rounded-lg`), matching the content it replaces. Prefer a shared `Skeleton` primitive over copy-pasting pulse blocks; page-local skeleton layouts (e.g. `ProductDetailLoading`) are fine when layout-specific.

```tsx
import { Skeleton } from "@/components/ui/skeleton";

if (isLoading) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
```

---

## When building a new screen

1. Check this table and [DESIGN.md](../../DESIGN.md) §5.5 first.
2. Compose page components from `Button`, `Input`, `Card`, `SafetyBadge`, `Skeleton`, etc.
3. While data loads, render skeleton placeholders — never `"Loading..."` text.
4. Put **feature-specific** layout in `pages/<section>/components/` (e.g. `IngredientAccordion`, `ProductCard`).
5. If you need a new reusable control (e.g. `FilterChip`, `SegmentedControl`), add **one** primitive to `components/ui/` and use it everywhere.

---

## Anti-patterns

| Don't | Do instead |
|-------|------------|
| Inline duplicate button styles on every page | `<Button variant="scan">` |
| Custom styled `<input>` in forms | `<Input />` or `<PasswordInput />` |
| One-off score pill markup | `<SafetyBadge />` |
| New card wrapper with same border/radius tokens | `<Card>` + children |
| `"Loading..."` / `"Loading profile…"` text while fetching | Skeleton blocks mirroring final layout |
| Full-page spinner or centered loading label | `<Skeleton>` rows/cards per section |
| Third-party UI kits (MUI, Chakra, etc.) | Extend `components/ui/` |

---

## Task files

Every frontend task under `docs/plan/tasks/**` includes a **UI components** section pointing here. Implementation agents must follow this doc before writing JSX.
