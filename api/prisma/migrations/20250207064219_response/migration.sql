/*
  Warnings:

  - Added the required column `stripeAddressLineOne` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeAddressLineTwo` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCardBrand` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCardLastFourDigit` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCountry` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeName` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePostalCode` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeState` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResponsePurchase` ADD COLUMN `stripeAddressLineOne` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeAddressLineTwo` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeCardBrand` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeCardLastFourDigit` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripePostalCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripeState` VARCHAR(191) NOT NULL;
