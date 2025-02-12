/*
  Warnings:

  - You are about to alter the column `paidStatus` on the `ResponsePurchase` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `ResponsePurchase` MODIFY `paidStatus` BOOLEAN NOT NULL;
