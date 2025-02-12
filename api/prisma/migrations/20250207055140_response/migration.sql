/*
  Warnings:

  - Added the required column `sessionIdUrl` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResponsePurchase` ADD COLUMN `sessionIdUrl` VARCHAR(191) NOT NULL;
