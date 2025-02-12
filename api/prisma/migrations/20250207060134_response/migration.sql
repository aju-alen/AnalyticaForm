/*
  Warnings:

  - A unique constraint covering the columns `[sessionIdUrl]` on the table `ResponsePurchase` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ResponsePurchase_sessionIdUrl_key` ON `ResponsePurchase`(`sessionIdUrl`);
