# Task: Mobile App Shell & Bottom Navigation

## Feature group

Feature 02 — App Shell & Navigation → [PROGRESS.md](../../PROGRESS.md#feature-02-app-shell--navigation)

## Objective

Replace CRM dashboard shell with **mobile-first** consumer app layout: **fixed bottom navigation** on mobile (Home, Scan, Search, History, Profile) and responsive shell on desktop.

> Canonical spec: [DESIGN.md](../../../DESIGN.md) §5.4 · [PRODUCT.md](../../../PRODUCT.md) §10

## Requirements

- Protected app routes use new shell, not sidebar CRM layout
- **Mobile-first:** fixed bottom navigation on `< lg` (required, not optional)
- Desktop `≥ lg`: bottom nav hidden; same five destinations via side or top nav
- Redirect `/` and post-login to Home, not dashboard
- Remove placeholder lead metrics from dashboard (delete or repurpose page)

## Subtasks

- [x] Create `components/layout/bottom-nav.tsx` with 5 tabs + active state
- [x] Create `components/layout/app-shell.tsx` wrapping outlet + bottom nav
- [x] Update `app/src/routes/routes.ts`: `home`, `scan`, `search`, `history`, `profile` paths
- [x] Create placeholder pages: `pages/home`, `pages/scan`, `pages/search`, `pages/history`, `pages/profile`
- [x] Wire protected routes in `routes/index.tsx` with `AppShell` layout
- [x] Update `ProtectedRoute` fallback to `Routes.home.root`
- [x] Post-login redirect → home
- [x] Remove or archive `pages/dashboard` CRM placeholders
- [x] Update sidebar component — remove from consumer flow or delete
- [x] Responsive: bottom nav hidden on `lg:` with desktop side nav

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — bottom nav tab buttons use `Button` `ghost` / active state via `cn()`; shell pages use `Card` for placeholders. Do not hand-roll nav pill styles.

## Technical Notes

- Follow frontend-design skill for clean, rounded, mobile-first UI
- Use Lucide icons: Home, ScanLine, Search, History, User
- Pages can show "Coming soon" only until their feature slice ships — shell must be navigable

## Acceptance Criteria

- [x] Logged-in user lands on Home with working bottom navigation
- [x] All 5 tabs navigate to distinct routes without full page reload issues
- [x] Unauthenticated user redirected to sign-in
- [x] No CRM/lead copy visible in navigation or home placeholder
