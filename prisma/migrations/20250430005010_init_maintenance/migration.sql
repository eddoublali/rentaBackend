-- CreateTable
CREATE TABLE `Maintenance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehicleId` INTEGER NOT NULL,
    `currentMileage` INTEGER NULL,
    `nextOilChange` INTEGER NULL,
    `status` ENUM('PENDING', 'COMPLETED') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `maintenance` ENUM('OIL_CHANGE', 'TIMING_CHAIN', 'WASHING', 'BRAKE_CHANGE', 'BATTERY_CHECK', 'GENERAL_SERVICE', 'OTHER') NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Maintenance` ADD CONSTRAINT `Maintenance_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
