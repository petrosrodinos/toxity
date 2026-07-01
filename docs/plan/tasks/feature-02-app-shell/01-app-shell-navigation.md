# Task: Mobile App Shell & Bottom Navigation

## Feature group

Feature 02 — App Shell & Navigation → [PROGRESS.md](../../PROGRESS.md#feature-02-app-shell--navigation)

## Objective

Replace CRM dashboard shell with consumer app layout: bottom nav (Home, Scan, Search, History, Profile) and mobile-first responsive shell.

## Requirements

- Protected app routes use new shell, not sidebar CRM layout
- Bottom navigation on mobile; optional side nav on desktop
- Redirect `/` and post-login to Home, not dashboard
- Remove placeholder lead metrics from dashboard (delete or repurpose page)

## Subtasks

- [ ] Create `components/layout/bottom-nav.tsx` with 5 tabs + active state
- [ ] Create `components/layout/app-shell.tsx` wrapping outlet + bottom nav
- [ ] Update `app/src/routes/routes.ts`: `home`, `scan`, `search`, `history`, `profile` paths
- [ ] Create placeholder pages: `pages/home`, `pages/scan`, `pages/search`, `pages/history`, `pages/profile`
- [ ] Wire protected routes in `routes/index.tsx` with `AppShell` layout
- [ ] Update `ProtectedRoute` fallback to `Routes.home.root`
- [ ] Post-login redirect → home
- [ ] Remove or archive `pages/dashboard` CRM placeholders
- [ ] Update sidebar component — remove from consumer flow or delete
- [ ] Responsive: bottom nav hidden on `lg:` with top nav tabs alternative (optional)

## Technical Notes

- Follow frontend-design skill for clean, rounded, mobile-first UI
- Use Lucide icons: Home, ScanLine, Search, History, User
- Pages can show "Coming soon" only until their feature slice ships — shell must be navigable

## Acceptance Criteria

- [ ] Logged-in user lands on Home with working bottom navigation
- [ ] All 5 tabs navigate to distinct routes without full page reload issues
- [ ] Unauthenticated user redirected to sign-in
- [ ] No CRM/lead copy visible in navigation or home placeholder
