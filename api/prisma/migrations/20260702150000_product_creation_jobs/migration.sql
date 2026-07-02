-- CreateEnum
CREATE TYPE "ProductCreationJobStatus" AS ENUM ('PENDING', 'OCR', 'ANALYZING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "product_creation_jobs" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "status" "ProductCreationJobStatus" NOT NULL DEFAULT 'PENDING',
    "barcode" TEXT,
    "ingredient_label_image_url" TEXT,
    "front_label_image_url" TEXT,
    "ocr_result" JSONB,
    "product_uuid" TEXT,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_creation_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_creation_jobs_uuid_key" ON "product_creation_jobs"("uuid");

-- CreateIndex
CREATE INDEX "product_creation_jobs_user_uuid_idx" ON "product_creation_jobs"("user_uuid");

-- CreateIndex
CREATE INDEX "product_creation_jobs_uuid_idx" ON "product_creation_jobs"("uuid");

-- CreateIndex
CREATE INDEX "product_creation_jobs_status_idx" ON "product_creation_jobs"("status");

-- AddForeignKey
ALTER TABLE "product_creation_jobs" ADD CONSTRAINT "product_creation_jobs_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
