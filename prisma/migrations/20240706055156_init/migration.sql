/*
  Warnings:

  - A unique constraint covering the columns `[name,images]` on the table `productCart` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `productCart_name_images_email_key` ON `productcart`;

-- CreateIndex
CREATE UNIQUE INDEX `productCart_name_images_key` ON `productCart`(`name`, `images`);
