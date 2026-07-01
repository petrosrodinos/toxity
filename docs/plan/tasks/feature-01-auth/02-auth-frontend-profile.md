# Task: Auth Frontend & Profile Settings

## Feature group

Feature 01 — Authentication & User Profile → [PROGRESS.md](../../PROGRESS.md#feature-01-authentication--user-profile)

## Objective

Wire frontend auth flows to new API endpoints and build profile/settings page.

## Requirements

- Connect existing sign-in/sign-up to API (already partial)
- Add forgot password, reset password, email verification pages
- Implement token refresh in axios interceptor
- Profile page: name, avatar, country, language, theme, notification toggles
- All routes via `Routes` object; all API paths via `ApiRoutes`

## Subtasks

- [ ] Update `app/src/config/api/routes.ts` with all auth/user endpoints
- [ ] Implement `features/auth/services/` for forgot, reset, verify, refresh
- [ ] Implement `features/user/services/user.services.ts` for me + patch + avatar
- [ ] Hooks: `useGetMe`, `useUpdateProfile`, `useUploadAvatar`
- [ ] Pages: forgot-password, reset-password (`?token=`), verify-email (`?token=`)
- [ ] Axios interceptor: on 401 try refresh once, then redirect to sign-in
- [ ] Add routes to `app/src/routes/routes.ts` and `routes/index.tsx`
- [ ] Profile settings page under `/profile/settings` (or tab in profile)
- [ ] Theme toggle writes to user profile + local Zustand/theme provider
- [ ] Toast on all mutation success/error

## UI components

> **Required:** [05-frontend-ui-primitives.md](../../directions/05-frontend-ui-primitives.md) — reuse `Button`, `Input`, `PasswordInput`, `Card` from `app/src/components/ui/`. Do not duplicate control styles on profile/settings pages.

## Technical Notes

- Remove or stub unused admin_login_to_account until admin slice
- Use React Hook Form + zodResolver with plain Tailwind-styled fields (see auth sign-in/sign-up)
- Avatar upload: multipart via axios

## Acceptance Criteria

- [ ] User can register, log in, log out
- [ ] User can request password reset and set new password via email link
- [ ] User can verify email via link
- [ ] User can update profile and theme; changes persist after reload
- [ ] Expired access token auto-refreshes without forced logout
