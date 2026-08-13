-- AlterTable
ALTER TABLE `Survey` ADD COLUMN `closesAt` DATETIME(3) NULL;
ALTER TABLE `Survey` ADD COLUMN `maxResponses` INTEGER NULL;
ALTER TABLE `Survey` ADD COLUMN `accessPasswordHash` VARCHAR(191) NULL;
ALTER TABLE `Survey` ADD COLUMN `oneResponsePerPerson` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserSurveyResponse` ADD COLUMN `isComplete` BOOLEAN NOT NULL DEFAULT true;
