/*
  Warnings:

  - You are about to drop the column `selectedItems` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `surveyForms` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `selectedItems`,
    DROP COLUMN `surveyForms`,
    ADD COLUMN `allSelectedItems` JSON NOT NULL,
    ADD COLUMN `allSurveyForms` JSON NOT NULL;
