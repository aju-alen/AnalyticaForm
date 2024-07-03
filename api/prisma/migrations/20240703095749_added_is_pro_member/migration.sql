/*
  Warnings:

  - Added the required column `isSubscribed` to the `ProMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ProMember` ADD COLUMN `isSubscribed` BOOLEAN NOT NULL;
