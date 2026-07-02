-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ScanMethod" AS ENUM ('BARCODE', 'OCR');

-- CreateEnum
CREATE TYPE "ProductImageType" AS ENUM ('HERO', 'PACKAGE', 'INGREDIENT_LABEL', 'FRONT_LABEL');

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "barcode" TEXT,
    "name" TEXT NOT NULL,
    "brand_uuid" TEXT NOT NULL,
    "subcategory_uuid" TEXT NOT NULL,
    "description" TEXT,
    "ai_summary" TEXT,
    "benefits" TEXT,
    "risks" TEXT,
    "warnings" TEXT,
    "suitability" TEXT,
    "recommended_usage" TEXT,
    "storage_info" TEXT,
    "pregnancy_safety" "SafetyLevel",
    "children_safety" "SafetyLevel",
    "sensitive_skin_safety" "SafetyLevel",
    "allergy_warnings" TEXT,
    "environmental_impact" TEXT,
    "is_vegan" BOOLEAN,
    "is_cruelty_free" BOOLEAN,
    "overall_score" DECIMAL(4,2) NOT NULL,
    "color_indicator" "ColorIndicator" NOT NULL,
    "scientific_confidence" DECIMAL(4,2),
    "marketing_claims" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "package_size" TEXT,
    "verification_status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "scan_count" INTEGER NOT NULL DEFAULT 0,
    "ai_version" TEXT,
    "faq" JSONB,
    "alternative_product_uuids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "similar_product_uuids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_ingredients" (
    "id" SERIAL NOT NULL,
    "product_uuid" TEXT NOT NULL,
    "ingredient_uuid" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "product_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "product_uuid" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ProductImageType" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_product_scans" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "product_uuid" TEXT NOT NULL,
    "scanned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scan_method" "ScanMethod" NOT NULL,

    CONSTRAINT "user_product_scans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_uuid_key" ON "products"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_name_idx" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_uuid_idx" ON "products"("uuid");

-- CreateIndex
CREATE INDEX "products_brand_uuid_idx" ON "products"("brand_uuid");

-- CreateIndex
CREATE INDEX "products_subcategory_uuid_idx" ON "products"("subcategory_uuid");

-- CreateIndex
CREATE INDEX "products_overall_score_idx" ON "products"("overall_score" DESC);

-- CreateIndex
CREATE INDEX "products_created_at_idx" ON "products"("created_at" DESC);

-- CreateIndex
CREATE INDEX "products_scan_count_idx" ON "products"("scan_count" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "products_name_brand_uuid_key" ON "products"("name", "brand_uuid");

-- CreateIndex
CREATE INDEX "product_ingredients_product_uuid_idx" ON "product_ingredients"("product_uuid");

-- CreateIndex
CREATE INDEX "product_ingredients_ingredient_uuid_idx" ON "product_ingredients"("ingredient_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "product_ingredients_product_uuid_ingredient_uuid_key" ON "product_ingredients"("product_uuid", "ingredient_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "product_ingredients_product_uuid_position_key" ON "product_ingredients"("product_uuid", "position");

-- CreateIndex
CREATE UNIQUE INDEX "product_images_uuid_key" ON "product_images"("uuid");

-- CreateIndex
CREATE INDEX "product_images_product_uuid_idx" ON "product_images"("product_uuid");

-- CreateIndex
CREATE INDEX "product_images_uuid_idx" ON "product_images"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_product_scans_uuid_key" ON "user_product_scans"("uuid");

-- CreateIndex
CREATE INDEX "user_product_scans_user_uuid_scanned_at_idx" ON "user_product_scans"("user_uuid", "scanned_at" DESC);

-- CreateIndex
CREATE INDEX "user_product_scans_uuid_idx" ON "user_product_scans"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_product_scans_user_uuid_product_uuid_key" ON "user_product_scans"("user_uuid", "product_uuid");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brand_uuid_fkey" FOREIGN KEY ("brand_uuid") REFERENCES "brands"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_uuid_fkey" FOREIGN KEY ("subcategory_uuid") REFERENCES "subcategories"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_ingredients" ADD CONSTRAINT "product_ingredients_ingredient_uuid_fkey" FOREIGN KEY ("ingredient_uuid") REFERENCES "ingredients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_product_scans" ADD CONSTRAINT "user_product_scans_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_product_scans" ADD CONSTRAINT "user_product_scans_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
