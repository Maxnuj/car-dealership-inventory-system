-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" UUID NOT NULL,
    "make" VARCHAR(80) NOT NULL,
    "model" VARCHAR(120) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "vehicles_price_check" CHECK ("price" >= 0),
    CONSTRAINT "vehicles_quantity_check" CHECK ("quantity" >= 0)
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "vehicle_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "purchase_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "purchases_quantity_check" CHECK ("quantity" > 0),
    CONSTRAINT "purchases_unit_price_check" CHECK ("unit_price" >= 0)
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_normalized_key" ON "users" (LOWER("username"));
CREATE UNIQUE INDEX "users_email_normalized_key" ON "users" (LOWER("email"));
CREATE INDEX "vehicles_browse_idx" ON "vehicles"("is_active", "created_at" DESC);
CREATE INDEX "vehicles_make_model_idx" ON "vehicles"("make", "model");
CREATE INDEX "vehicles_category_price_idx" ON "vehicles"("category", "price");
CREATE INDEX "purchases_user_date_idx" ON "purchases"("user_id", "purchase_date" DESC);
CREATE INDEX "purchases_vehicle_date_idx" ON "purchases"("vehicle_id", "purchase_date" DESC);

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
