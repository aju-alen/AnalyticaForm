-- CreateTable
CREATE TABLE `UserSurveyResponse` (
    `id` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL DEFAULT 'Anonymous',
    `userName` VARCHAR(191) NOT NULL DEFAULT 'Anonymous',
    `userResponse` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `surveyId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSurveyResponse` ADD CONSTRAINT `UserSurveyResponse_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
