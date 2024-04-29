-- AlterTable
ALTER TABLE `Survey` ADD COLUMN `surveyResponses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `surveyStatus` VARCHAR(191) NOT NULL DEFAULT 'draft';
