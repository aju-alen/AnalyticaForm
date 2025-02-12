/*
  Warnings:

  - The primary key for the `Industry` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `count` on the `Industry` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Industry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Industry` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Industry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `regionId` on the `Industry` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Region` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `totalCount` on the `Region` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Region` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Region` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `Education` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `percentage` to the `Industry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `percentage` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `population` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Education` DROP FOREIGN KEY `Education_industryId_fkey`;

-- DropForeignKey
ALTER TABLE `Industry` DROP FOREIGN KEY `Industry_regionId_fkey`;

-- DropIndex
DROP INDEX `Industry_name_regionId_key` ON `Industry`;

-- DropIndex
DROP INDEX `Region_name_key` ON `Region`;

-- AlterTable
ALTER TABLE `Industry` DROP PRIMARY KEY,
    DROP COLUMN `count`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `percentage` DOUBLE NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `regionId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Region` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `totalCount`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `percentage` DOUBLE NOT NULL,
    ADD COLUMN `population` INTEGER NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Education`;

-- CreateTable
CREATE TABLE `EducationLevel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `industryId` INTEGER NOT NULL,
    `percentage` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Industry` ADD CONSTRAINT `Industry_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `Region`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EducationLevel` ADD CONSTRAINT `EducationLevel_industryId_fkey` FOREIGN KEY (`industryId`) REFERENCES `Industry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
