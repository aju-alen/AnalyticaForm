-- AlterTable
ALTER TABLE `ResponsePurchase` MODIFY `stripeAddressLineOne` VARCHAR(191) NULL,
    MODIFY `stripeAddressLineTwo` VARCHAR(191) NULL,
    MODIFY `stripeCardBrand` VARCHAR(191) NULL,
    MODIFY `stripeCardLastFourDigit` VARCHAR(191) NULL,
    MODIFY `stripeCountry` VARCHAR(191) NULL,
    MODIFY `stripePostalCode` VARCHAR(191) NULL,
    MODIFY `stripeState` VARCHAR(191) NULL;
