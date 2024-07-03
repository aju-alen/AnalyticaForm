/*
  Warnings:

  - A unique constraint covering the columns `[subscriptionEmail]` on the table `ProMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[invoiceId]` on the table `ProMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hosted_invoice_pdf` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hosted_invoice_url` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceId` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionAmmount` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionEmail` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionPeriodEnd` to the `ProMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscriptionPeriodStart` to the `ProMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProMember` ADD COLUMN `customerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `hosted_invoice_pdf` VARCHAR(191) NOT NULL,
    ADD COLUMN `hosted_invoice_url` VARCHAR(191) NOT NULL,
    ADD COLUMN `invoiceId` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionAmmount` INTEGER NOT NULL,
    ADD COLUMN `subscriptionEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionPeriodEnd` INTEGER NOT NULL,
    ADD COLUMN `subscriptionPeriodStart` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProMember_subscriptionEmail_key` ON `ProMember`(`subscriptionEmail`);

-- CreateIndex
CREATE UNIQUE INDEX `ProMember_invoiceId_key` ON `ProMember`(`invoiceId`);
