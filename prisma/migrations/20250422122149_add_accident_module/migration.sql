-- CreateTable
CREATE TABLE `Accident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `clientId` INTEGER NULL,
    `accidentDate` DATETIME(3) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `repairCost` DOUBLE NULL,
    `fault` ENUM('CLIENT', 'THIRD_PARTY', 'UNKNOWN') NOT NULL DEFAULT 'UNKNOWN',
    `damagePhotos` VARCHAR(191) NULL,
    `status` ENUM('REPORTED', 'IN_PROGRESS', 'REPAIRED', 'CLOSED') NOT NULL DEFAULT 'REPORTED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Accident` ADD CONSTRAINT `Accident_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
