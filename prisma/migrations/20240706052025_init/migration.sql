/*
  Warnings:

  - A unique constraint covering the columns `[name,images,email]` on the table `productCart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `productCart_name_images_key` ON `productcart`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `country` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `productcart` ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL DEFAULT 'anonymus@gmail.com';

-- CreateIndex
CREATE UNIQUE INDEX `productCart_name_images_email_key` ON `productCart`(`name`, `images`, `email`);
