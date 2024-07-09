/*
  Warnings:

  - You are about to drop the column `qty` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `productcart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `qty`;

-- AlterTable
ALTER TABLE `productcart` DROP COLUMN `qty`;
