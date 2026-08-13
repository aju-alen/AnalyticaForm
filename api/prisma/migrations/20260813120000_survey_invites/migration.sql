-- CreateTable
CREATE TABLE `SurveyContact` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `unsubscribedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SurveyContact_userId_email_key`(`userId`, `email`),
    INDEX `SurveyContact_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyInviteCampaign` (
    `id` VARCHAR(191) NOT NULL,
    `surveyId` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(120) NOT NULL,
    `message` VARCHAR(2000) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'queued',
    `reminderAfterHours` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SurveyInviteCampaign_surveyId_createdAt_idx`(`surveyId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyInviteRecipient` (
    `id` VARCHAR(191) NOT NULL,
    `campaignId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `token` VARCHAR(64) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'queued',
    `errorMessage` VARCHAR(191) NULL,
    `sentAt` DATETIME(3) NULL,
    `openedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `remindedAt` DATETIME(3) NULL,
    `unsubscribedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SurveyInviteRecipient_token_key`(`token`),
    INDEX `SurveyInviteRecipient_campaignId_status_idx`(`campaignId`, `status`),
    INDEX `SurveyInviteRecipient_email_campaignId_idx`(`email`, `campaignId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SurveyContact` ADD CONSTRAINT `SurveyContact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyInviteCampaign` ADD CONSTRAINT `SurveyInviteCampaign_surveyId_fkey` FOREIGN KEY (`surveyId`) REFERENCES `Survey`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyInviteRecipient` ADD CONSTRAINT `SurveyInviteRecipient_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `SurveyInviteCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
