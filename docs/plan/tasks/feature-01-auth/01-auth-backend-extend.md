# Task: Extend Auth Backend

## Feature group

Feature 01 — Authentication & User Profile → [PROGRESS.md](../../PROGRESS.md#feature-01-authentication--user-profile)

## Objective

Complete backend auth: refresh token, forgot/reset password, email verification, and extended user profile fields.

## Requirements

- Extend Prisma `User` model per `directions/03-domain-model.md`
- Add `EmailVerificationToken`, `PasswordResetToken`, `RefreshToken` tables
- Implement missing endpoints per `directions/04-api-design.md` auth section
- Send verification and reset emails via existing mail integration
- Delete password from all API responses

## Subtasks

- [ ] Update `api/prisma/schema.prisma` with new User fields and token tables
- [ ] Run `prisma migrate dev` for migration
- [ ] Create `users` module: `users.controller.ts`, `users.service.ts`, `users.module.ts`
- [ ] `GET /users/me`, `PATCH /users/me` with DTOs
- [ ] `POST /users/me/avatar` — upload to GCS, save `avatar_url`
- [ ] Extend `auth` email controller: refresh, forgot-password, reset-password, verify, resend-verification
- [ ] Hash and store refresh tokens; validate on refresh endpoint
- [ ] On register: create verification token, send email, do not block login (or require verify per product decision — default: allow login, gate scan behind verify optional)
- [ ] Register `UsersModule` in `AppModule`
- [ ] Swagger decorators on all new endpoints

## Technical Notes

- Reuse existing `JwtGuard`, `CurrentUser` decorator from `shared/`
- Token expiry: verification 24h, reset 1h, refresh 7d
- Use `setImmediate` + try/catch for email sends
- Follow snake_case for method parameters per project rules
- Remove stale Appointly references in Swagger title when touching `main.ts`

## Acceptance Criteria

- [ ] New user registers → receives verification email (check logs or SendGrid)
- [ ] `POST /auth/email/verify` with valid token sets `email_verified_at`
- [ ] Forgot/reset password flow works end-to-end
- [ ] `POST /auth/email/refresh` returns new access token
- [ ] `GET /users/me` returns profile without password
- [ ] `PATCH /users/me` updates theme, language, country, name
