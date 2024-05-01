/*
  Warnings:

  - You are about to drop the column `surveyJSON` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `selectedItems` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyForms` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `surveyJSON`,
    ADD COLUMN `selectedItems` JSON NOT NULL,
    ADD COLUMN `surveyForms` JSON NOT NULL;
