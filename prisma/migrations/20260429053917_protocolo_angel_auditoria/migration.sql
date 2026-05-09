/*
  Warnings:

  - You are about to alter the column `severity` on the `auditlog` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to drop the column `completed` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - Added the required column `activityName` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `auditlog` ADD COLUMN `targetUserId` INTEGER NULL,
    ADD COLUMN `taskId` INTEGER NULL,
    MODIFY `event` VARCHAR(250) NOT NULL,
    MODIFY `severity` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `completed`,
    DROP COLUMN `title`,
    ADD COLUMN `activityName` VARCHAR(250) NOT NULL,
    ADD COLUMN `importance` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'No realizada';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `role`,
    ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `email` VARCHAR(250) NOT NULL,
    MODIFY `password` VARCHAR(250) NOT NULL,
    MODIFY `name` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(250) NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `AuditLog_targetUserId_idx` ON `AuditLog`(`targetUserId`);

-- CreateIndex
CREATE INDEX `AuditLog_taskId_idx` ON `AuditLog`(`taskId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_targetUserId_fkey` FOREIGN KEY (`targetUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `auditlog` RENAME INDEX `AuditLog_userId_fkey` TO `AuditLog_userId_idx`;

-- RenameIndex
ALTER TABLE `task` RENAME INDEX `Task_userId_fkey` TO `Task_userId_idx`;
