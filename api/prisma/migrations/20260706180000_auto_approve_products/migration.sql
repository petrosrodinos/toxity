UPDATE "products"
SET "verification_status" = 'APPROVED'
WHERE "verification_status" = 'PENDING';

ALTER TABLE "products" ALTER COLUMN "verification_status" SET DEFAULT 'APPROVED';
