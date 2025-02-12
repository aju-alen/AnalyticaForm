/*
  Warnings:

  - You are about to drop the `EducationLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Industry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Region` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `EducationLevel` DROP FOREIGN KEY `EducationLevel_industryId_fkey`;

-- DropForeignKey
ALTER TABLE `Industry` DROP FOREIGN KEY `Industry_regionId_fkey`;

-- DropTable
DROP TABLE `EducationLevel`;

-- DropTable
DROP TABLE `Industry`;

-- DropTable
DROP TABLE `Region`;

-- CreateTable
CREATE TABLE `ResponsePurchase` (
    `id` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `responseQuantity` INTEGER NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `amountCurrency` VARCHAR(191) NOT NULL,
    `paidStatus` VARCHAR(191) NOT NULL,
    `stripePaymentIntentId` VARCHAR(191) NOT NULL,
    `stripeRecieptUrl` VARCHAR(191) NOT NULL,
    `selectedRegions` VARCHAR(191) NOT NULL,
    `selectedIndustries` VARCHAR(191) NOT NULL,
    `selectedEducationLevels` VARCHAR(191) NOT NULL,
    `selectedPositions` VARCHAR(191) NOT NULL,
    `selectedExperience` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
