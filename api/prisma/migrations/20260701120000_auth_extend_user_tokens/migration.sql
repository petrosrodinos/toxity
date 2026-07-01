-- User profile: name only
ALTER TABLE "users" DROP COLUMN IF EXISTS "avatar_url";
ALTER TABLE "users" DROP COLUMN IF EXISTS "country";
ALTER TABLE "users" DROP COLUMN IF EXISTS "preferred_language";
ALTER TABLE "users" DROP COLUMN IF EXISTS "theme";
ALTER TABLE "users" DROP COLUMN IF EXISTS "notification_settings";
ALTER TABLE "users" DROP COLUMN IF EXISTS "email_verified_at";
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "name" TEXT;

-- Remove email verification + refresh tokens
DROP TABLE IF EXISTS "email_verification_tokens";
DROP TABLE IF EXISTS "refresh_tokens";
DROP TYPE IF EXISTS "Theme";

-- Password reset tokens
CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_uuid_key" ON "password_reset_tokens"("uuid");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_uuid_idx" ON "password_reset_tokens"("user_uuid");
CREATE INDEX IF NOT EXISTS "password_reset_tokens_uuid_idx" ON "password_reset_tokens"("uuid");

DO $$ BEGIN
    ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_uuid_fkey"
        FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
