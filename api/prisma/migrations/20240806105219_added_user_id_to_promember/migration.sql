/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ProMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `ProMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProMember` ADD COLUMN `userId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ProMember_userId_key` ON `ProMember`(`userId`);

-- AddForeignKey
ALTER TABLE `ProMember` ADD CONSTRAINT `ProMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
