-- CreateTable
CREATE TABLE "product_analysis_versions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "product_uuid" TEXT NOT NULL,
    "ai_version" TEXT,
    "snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_analysis_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingredient_analysis_versions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "ingredient_uuid" TEXT NOT NULL,
    "ai_version" TEXT,
    "snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ingredient_analysis_versions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_analysis_versions_uuid_key" ON "product_analysis_versions"("uuid");

-- CreateIndex
CREATE INDEX "product_analysis_versions_product_uuid_idx" ON "product_analysis_versions"("product_uuid");

-- CreateIndex
CREATE INDEX "product_analysis_versions_uuid_idx" ON "product_analysis_versions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ingredient_analysis_versions_uuid_key" ON "ingredient_analysis_versions"("uuid");

-- CreateIndex
CREATE INDEX "ingredient_analysis_versions_ingredient_uuid_idx" ON "ingredient_analysis_versions"("ingredient_uuid");

-- CreateIndex
CREATE INDEX "ingredient_analysis_versions_uuid_idx" ON "ingredient_analysis_versions"("uuid");

-- AddForeignKey
ALTER TABLE "product_analysis_versions" ADD CONSTRAINT "product_analysis_versions_product_uuid_fkey" FOREIGN KEY ("product_uuid") REFERENCES "products"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_analysis_versions" ADD CONSTRAINT "ingredient_analysis_versions_ingredient_uuid_fkey" FOREIGN KEY ("ingredient_uuid") REFERENCES "ingredients"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
