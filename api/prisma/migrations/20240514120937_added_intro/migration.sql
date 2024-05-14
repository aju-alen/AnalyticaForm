/*
  Warnings:

  - You are about to drop the column `formQuestions` on the `Survey` table. All the data in the column will be lost.
  - Added the required column `introduction` to the `UserSurveyResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Survey` DROP COLUMN `formQuestions`;

-- AlterTable
ALTER TABLE `UserSurveyResponse` ADD COLUMN `introduction` BOOLEAN NOT NULL;
