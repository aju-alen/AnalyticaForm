/*
  Warnings:

  - You are about to drop the `Demographic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SurveyEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Demographic` DROP FOREIGN KEY `Demographic_educationId_fkey`;

-- DropForeignKey
ALTER TABLE `SurveyEntry` DROP FOREIGN KEY `SurveyEntry_demographicId_fkey`;

-- DropForeignKey
ALTER TABLE `SurveyEntry` DROP FOREIGN KEY `SurveyEntry_educationId_fkey`;

-- DropForeignKey
ALTER TABLE `SurveyEntry` DROP FOREIGN KEY `SurveyEntry_industryId_fkey`;

-- DropForeignKey
ALTER TABLE `SurveyEntry` DROP FOREIGN KEY `SurveyEntry_regionId_fkey`;

-- DropTable
DROP TABLE `Demographic`;

-- DropTable
DROP TABLE `SurveyEntry`;
