-- CreateEnum
CREATE TYPE "FavoriteEntityType" AS ENUM ('PRODUCT', 'INGREDIENT', 'BRAND');

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "entity_type" "FavoriteEntityType" NOT NULL,
    "entity_uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_uuid_key" ON "user_favorites"("uuid");

-- CreateIndex
CREATE INDEX "user_favorites_user_uuid_idx" ON "user_favorites"("user_uuid");

-- CreateIndex
CREATE INDEX "user_favorites_uuid_idx" ON "user_favorites"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_user_uuid_entity_type_entity_uuid_key" ON "user_favorites"("user_uuid", "entity_type", "entity_uuid");

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
