# Task: Extend Auth Backend

## Feature group

Feature 01 — Authentication & User Profile → [PROGRESS.md](../../PROGRESS.md#feature-01-authentication--user-profile)

## Objective

Complete backend auth: JWT access token (no refresh), forgot/reset password, and minimal user profile (`name` only).

**Out of scope:** refresh tokens, email verification, avatar, country, language, theme, notifications.

## Requirements

- Extend Prisma `User` with optional `name`
- Add `PasswordResetToken` table only
- Auth endpoints per `directions/04-api-design.md`
- Send password reset emails via existing mail integration
- Delete password from all API responses

## Subtasks

- [x] Update `api/prisma/schema.prisma` — `name` + `PasswordResetToken` only
- [x] Migration SQL in `prisma/migrations/20260701120000_auth_extend_user_tokens/`
- [x] Create `users` module: `GET/PATCH /users/me` (name only)
- [x] Extend `auth` email controller: forgot-password, reset-password
- [x] Register/login return `access_token` + `expires_in` + `user` (no `refresh_token`)
- [x] Register `UsersModule` in `AppModule`
- [x] Swagger decorators on all new endpoints

## Technical Notes

- JWT lifetime: `JWT_EXPIRATION_TIME` env var
- Password reset token expiry: 1h
- Use `setImmediate` + try/catch for email sends

## Acceptance Criteria

- [ ] Forgot/reset password flow works end-to-end
- [ ] Register/login return JWT without refresh token
- [ ] `GET /users/me` returns profile without password
- [ ] `PATCH /users/me` updates `name`
