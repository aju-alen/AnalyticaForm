/*
  Warnings:

  - You are about to drop the column `userId` on the `ResponsePurchase` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ResponsePurchase` DROP FOREIGN KEY `ResponsePurchase_userId_fkey`;

-- AlterTable
ALTER TABLE `ResponsePurchase` DROP COLUMN `userId`;
