/*
  Warnings:

  - You are about to drop the column `interimScore` on the `driresponseData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `driresponseData` DROP COLUMN `interimScore`,
    ADD COLUMN `cat1` DOUBLE NULL,
    ADD COLUMN `cat10` DOUBLE NULL,
    ADD COLUMN `cat2` DOUBLE NULL,
    ADD COLUMN `cat3` DOUBLE NULL,
    ADD COLUMN `cat4` DOUBLE NULL,
    ADD COLUMN `cat5` DOUBLE NULL,
    ADD COLUMN `cat6` DOUBLE NULL,
    ADD COLUMN `cat7` DOUBLE NULL,
    ADD COLUMN `cat8` DOUBLE NULL,
    ADD COLUMN `cat9` DOUBLE NULL;
