/*
  Warnings:

  - You are about to drop the column `allSelectedItems` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the column `allSurveyForms` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `allSelectedItems`,
    DROP COLUMN `allSurveyForms`,
    ADD COLUMN `selectedItems` JSON NOT NULL,
    ADD COLUMN `surveyForms` JSON NOT NULL;
