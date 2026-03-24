-- CreateTable
CREATE TABLE `driresponseData` (
    `id` VARCHAR(191) NOT NULL,
    `responseId` VARCHAR(191) NOT NULL,
    `interimScore` DOUBLE NOT NULL,
    `bandPositionLabel` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `driresponseData_responseId_key`(`responseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `driresponseData` ADD CONSTRAINT `driresponseData_responseId_fkey` FOREIGN KEY (`responseId`) REFERENCES `UserSurveyResponse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
