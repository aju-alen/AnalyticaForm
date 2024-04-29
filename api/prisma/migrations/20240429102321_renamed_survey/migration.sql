/*
  Warnings:

  - You are about to drop the column `description` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `surveyDescription` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyTitle` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `description`,
    DROP COLUMN `title`,
    ADD COLUMN `surveyDescription` VARCHAR(191) NOT NULL,
    ADD COLUMN `surveyTitle` VARCHAR(191) NOT NULL;
