-- Allow full HTML email templates (VARCHAR(191) truncates)
ALTER TABLE `driresponseData` MODIFY COLUMN `htmlContent` LONGTEXT NULL;
