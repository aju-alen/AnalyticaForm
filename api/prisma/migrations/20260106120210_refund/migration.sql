-- CreateTable
CREATE TABLE `RefundRequest` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `proMemberId` VARCHAR(191) NOT NULL,
    `invoiceId` VARCHAR(191) NOT NULL,
    `customerId` VARCHAR(191) NOT NULL,
    `subscriptionPeriodStart` INTEGER NOT NULL,
    `refundAmount` INTEGER NOT NULL,
    `refundCurrency` VARCHAR(191) NOT NULL,
    `refundStatus` VARCHAR(191) NOT NULL,
    `stripeRefundId` VARCHAR(191) NULL,
    `refundReason` VARCHAR(191) NULL,
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RefundRequest_userId_idx`(`userId`),
    INDEX `RefundRequest_proMemberId_idx`(`proMemberId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RefundRequest` ADD CONSTRAINT `RefundRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundRequest` ADD CONSTRAINT `RefundRequest_proMemberId_fkey` FOREIGN KEY (`proMemberId`) REFERENCES `ProMember`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
