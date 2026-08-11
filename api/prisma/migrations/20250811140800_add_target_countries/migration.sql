-- AlterTable
ALTER TABLE `Survey` ADD COLUMN `targetCountries` JSON NULL;
UPDATE `Survey` SET `targetCountries` = JSON_ARRAY() WHERE `targetCountries` IS NULL;
ALTER TABLE `Survey` MODIFY `targetCountries` JSON NOT NULL;
