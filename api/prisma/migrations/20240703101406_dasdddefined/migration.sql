/*
  Warnings:

  - You are about to drop the column `userId` on the `ProMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProMember` DROP FOREIGN KEY `ProMember_userId_fkey`;

-- AlterTable
ALTER TABLE `ProMember` DROP COLUMN `userId`;
