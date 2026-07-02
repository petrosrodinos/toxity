-- CreateEnum
CREATE TYPE "ColorIndicator" AS ENUM ('VERY_SAFE', 'SAFE', 'MODERATE', 'CAUTION', 'HIGH_RISK', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SafetyLevel" AS ENUM ('SAFE', 'CAUTION', 'AVOID', 'UNKNOWN');

-- CreateTable
CREATE TABLE "ingredients" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_normalized" TEXT NOT NULL,
    "synonyms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scientific_name" TEXT,
    "description" TEXT,
    "ai_summary" TEXT,
    "full_description" TEXT,
    "benefits" TEXT,
    "risks" TEXT,
    "safety_explanation" TEXT,
    "purpose" TEXT,
    "common_uses" TEXT,
    "pregnancy_safety" "SafetyLevel",
    "child_safety" "SafetyLevel",
    "allergy_risk" TEXT,
    "carcinogenic_evidence" TEXT,
    "hormone_disruption_risk" TEXT,
    "irritation_risk" TEXT,
    "acne_rating" INTEGER,
    "comedogenic_rating" INTEGER,
    "sensitive_skin_suitability" "SafetyLevel",
    "environmental_impact" TEXT,
    "is_vegan" BOOLEAN,
    "is_cruelty_free" BOOLEAN,
    "is_biodegradable" BOOLEAN,
    "overall_score" DECIMAL(4,2),
    "safety_score" DECIMAL(4,2),
    "risk_score" DECIMAL(4,2),
    "confidence_score" DECIMAL(4,2),
    "color_indicator" "ColorIndicator" NOT NULL DEFAULT 'UNKNOWN',
    "research_summary" TEXT,
    "references" JSONB,
    "ai_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_uuid_key" ON "ingredients"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_name_normalized_key" ON "ingredients"("name_normalized");

-- CreateIndex
CREATE INDEX "ingredients_name_idx" ON "ingredients"("name");

-- CreateIndex
CREATE INDEX "ingredients_uuid_idx" ON "ingredients"("uuid");

-- CreateIndex
CREATE INDEX "ingredients_color_indicator_idx" ON "ingredients"("color_indicator");
