-- CreateTable
CREATE TABLE `DriInterim10SummaryPayment` (
    `id` VARCHAR(191) NOT NULL,
    `responseId` VARCHAR(191) NOT NULL,
    `paidStatus` BOOLEAN NOT NULL DEFAULT false,
    `stripeId` VARCHAR(191) NOT NULL,
    `emailId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DriInterim10SummaryPayment_responseId_key`(`responseId`),
    UNIQUE INDEX `DriInterim10SummaryPayment_stripeId_key`(`stripeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriFullReportPayment` (
    `id` VARCHAR(191) NOT NULL,
    `responseId` VARCHAR(191) NOT NULL,
    `paidStatus` BOOLEAN NOT NULL DEFAULT false,
    `stripeId` VARCHAR(191) NOT NULL,
    `emailId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DriFullReportPayment_responseId_key`(`responseId`),
    UNIQUE INDEX `DriFullReportPayment_stripeId_key`(`stripeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DriInterim10SummaryPayment` ADD CONSTRAINT `DriInterim10SummaryPayment_responseId_fkey` FOREIGN KEY (`responseId`) REFERENCES `UserSurveyResponse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriFullReportPayment` ADD CONSTRAINT `DriFullReportPayment_responseId_fkey` FOREIGN KEY (`responseId`) REFERENCES `UserSurveyResponse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
