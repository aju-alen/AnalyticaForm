/*
  Warnings:

  - Added the required column `formQuestions` to the `UserSurveyResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserSurveyResponse` ADD COLUMN `formQuestions` JSON NOT NULL;
