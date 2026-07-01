# Task: Auth Frontend & Profile Settings

## Feature group

Feature 01 — Authentication & User Profile → [PROGRESS.md](../../PROGRESS.md#feature-01-authentication--user-profile)

## Objective

Wire frontend auth flows to API endpoints and build minimal profile settings.

## Requirements

- Connect existing sign-in/sign-up to API (already partial)
- Add forgot password, reset password pages
- JWT only — no refresh token; on 401/expired JWT redirect to sign-in
- Profile page: update display name only
- All routes via `Routes` object; all API paths via `ApiRoutes`

## Subtasks

- [ ] Update `app/src/config/api/routes.ts` with auth/user endpoints (align with `04-api-design.md`)
- [ ] Implement `features/auth/services/` for forgot, reset
- [ ] Implement `features/user/services/user.services.ts` for `GET/PATCH /users/me`
- [ ] Hooks: `useGetMe`, `useUpdateProfile`
- [ ] Pages: forgot-password, reset-password (`?token=`)
- [ ] Axios interceptor: on expired JWT or 401 → logout + redirect to sign-in (no refresh retry)
- [x] Remove dead refresh-token code (`refreshAccountToken`, `AuthTokenRefresher`)
- [ ] Add routes to `app/src/routes/routes.ts` and `routes/index.tsx`
- [ ] Profile settings page (name field)
- [ ] Toast on all mutation success/error

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — reuse `Button`, `Input`, `PasswordInput`, `Card` from `app/src/components/ui/`.

## Acceptance Criteria

- [ ] User can register, log in, log out
- [ ] User can request password reset and set new password via email link
- [ ] User can update name; changes persist after reload
- [ ] Expired JWT redirects to sign-in (user signs in again)
