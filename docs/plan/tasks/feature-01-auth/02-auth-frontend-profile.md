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

- [x] Update `app/src/config/api/routes.ts` with auth/user endpoints (align with `04-api-design.md`)
- [x] Implement `features/auth/services/` for forgot, reset
- [x] Implement `features/user/services/user.services.ts` for `GET/PATCH /users/me`
- [x] Hooks: `useGetMe`, `useUpdateProfile`
- [x] Pages: forgot-password, reset-password (`?token=`)
- [x] Axios interceptor: on expired JWT or 401 → logout + redirect to sign-in (no refresh retry)
- [x] Remove dead refresh-token code (`refreshAccountToken`, `AuthTokenRefresher`)
- [x] Add routes to `app/src/routes/routes.ts` and `routes/index.tsx`
- [x] Profile settings page (name field)
- [x] Toast on all mutation success/error

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — reuse `Button`, `Input`, `PasswordInput`, `Card` from `app/src/components/ui/`.

## Acceptance Criteria

- [x] User can register, log in, log out
- [x] User can request password reset and set new password via email link
- [x] User can update name; changes persist after reload
- [x] Expired JWT redirects to sign-in (user signs in again)
