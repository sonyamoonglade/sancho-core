CREATE OR REPLACE FUNCTION init_types() RETURNS integer AS $$
DECLARE e1 INTEGER;
BEGIN
    SELECT INTO e1 (SELECT 1 FROM pg_type WHERE typname = 'role');
    IF e1 IS NULL THEN
        CREATE TYPE "role" AS ENUM('worker', 'master', 'user');
        CREATE TYPE "pay" AS ENUM('onPickup','online');
        CREATE TYPE "order_status" as ENUM('waiting_for_verification','verified','completed','cancelled');
    END IF;
    RETURN e1;
END
$$ LANGUAGE plpgsql;

SELECT init_types();

SET TIMEZONE='utc';



CREATE TABLE IF NOT EXISTS "category"(
    "category_id" SERIAL PRIMARY KEY,
    "rank" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users"(
    "id" SERIAL PRIMARY KEY,
    "phone_number" VARCHAR(255) UNIQUE DEFAULT NULL,
    "role" role NOT NULL,
    "remembered_delivery_address" VARCHAR(1000) DEFAULT NULL,
    "login" VARCHAR(100) UNIQUE DEFAULT NULL,
    "password" VARCHAR(100) DEFAULT NULL,
    "name" VARCHAR(100) DEFAULT NULL
);

CREATE INDEX "usr_phone_idx" ON "users"("phone_number");

CREATE TABLE IF NOT EXISTS "sessions"(
    "session_id" VARCHAR(500) PRIMARY KEY,
    "user_id" INTEGER NOT NULL UNIQUE
);

ALTER TABLE "sessions" ADD CONSTRAINT "user_id_fk"
    FOREIGN KEY("user_id")
    REFERENCES users("id")
    ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "marks"(
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER,
    "content" VARCHAR(255) NOT NULL,
    "is_important" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL
);

ALTER TABLE "marks" ADD CONSTRAINT "user_id_fk"
    FOREIGN KEY("user_id")
    REFERENCES users("id")
    ON DELETE CASCADE;

ALTER TABLE "marks" ADD CONSTRAINT "user_id_content_unique" UNIQUE ("content","user_id");

CREATE TABLE IF NOT EXISTS "products"(
    "id" SERIAL PRIMARY KEY,
    "category_id" INTEGER NOT NULL,
    "features" VARCHAR(1000) NOT NULL,
    "image_url" VARCHAR(512),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "translate" VARCHAR(255) NOT NULL UNIQUE,
    "currency" VARCHAR(10) DEFAULT '₽',
    "price" DOUBLE PRECISION NOT NULL,
    "has_image" BOOLEAN NOT NULL DEFAULT FALSE,
    "approved" BOOLEAN NOT NULL DEFAULT FALSE,
    "description" VARCHAR(1000) DEFAULT NULL
);

ALTER TABLE "products" ADD CONSTRAINT "category_id_fk"
    FOREIGN KEY("category_id")
    REFERENCES category("category_id")
    ON DELETE CASCADE;

CREATE TABLE IF NOT EXISTS "orders"(
    "id" SERIAL PRIMARY KEY,
    "user_id" INTEGER NOT NULL,
    "cart" VARCHAR[] NOT NULL,
    "status" order_status NOT NULL,
    "amount" REAL NOT NULL,
    "discount" REAL DEFAULT 0,
    "discounted_amount" REAL NOT NULL,
    "is_delivered" BOOLEAN NOT NULL,
    "is_delivered_asap" BOOLEAN NOT NULL,
    "delivery_details" JSON DEFAULT '{}',
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
    "verified_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    "completed_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    "cancelled_at" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    "cancelled_by" INTEGER DEFAULT NULL,
    "cancel_explanation" VARCHAR(1000) DEFAULT NULL,
    "pay" pay NOT NULL
);

ALTER TABLE "orders" ADD CONSTRAINT "user_id_fk"
    FOREIGN KEY("user_id")
    REFERENCES users("id")
    ON DELETE SET NULL;

ALTER TABLE "orders" ADD CONSTRAINT "cancelled_by_fk"
    FOREIGN KEY("cancelled_by")
    REFERENCES users("id")
    ON DELETE SET NULL;

CREATE INDEX "orders_status_idx" ON "orders"("status");

CREATE TABLE IF NOT EXISTS "misc"(
    "id" INTEGER DEFAULT 1 UNIQUE,
    "delivery_punishment_value" INTEGER NOT NULL,
    "delivery_punishment_threshold" INTEGER NOT NULL,
    "order_creation_delay" INTEGER NOT NULL,
    "reg_cust_threshold" INTEGER NOT NULL,
    "reg_cust_duration" INTEGER NOT NULL,
    "cancel_ban_duration" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "promotions"(
    "promotion_id" SERIAL PRIMARY KEY,
    "main_title" VARCHAR(255) NOT NULL,
    "sub_title" VARCHAR(255) NOT NULL,
    "sub_text" VARCHAR(255) NOT NULL
);
-- Default values...
INSERT INTO "misc" (delivery_punishment_threshold,
                    delivery_punishment_value,
                    order_creation_delay,
                    reg_cust_duration,
                    reg_cust_threshold,
                    cancel_ban_duration)
    VALUES (400,100,5,30,5000,5)