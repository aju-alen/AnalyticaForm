/*
  Warnings:

  - Added the required column `surveyJSON` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Survey` ADD COLUMN `surveyJSON` JSON NOT NULL;
