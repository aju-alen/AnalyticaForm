/*
  Warnings:

  - You are about to drop the column `userName` on the `ResponsePurchase` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ResponsePurchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResponsePurchase` DROP COLUMN `userName`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ResponsePurchase` ADD CONSTRAINT `ResponsePurchase_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
