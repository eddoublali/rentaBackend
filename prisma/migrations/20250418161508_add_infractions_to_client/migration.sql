/*
  Warnings:

  - Added the required column `clientId` to the `Infraction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `infraction` ADD COLUMN `clientId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Infraction` ADD CONSTRAINT `Infraction_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
