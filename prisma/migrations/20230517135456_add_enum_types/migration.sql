/*
  Warnings:

  - The `sex` column on the `pets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `size` column on the `pets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `pet_type` on the `pets` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Size" AS ENUM ('TINY', 'SMALL', 'MEDIUM', 'LARGE', 'GIANT');

-- CreateEnum
CREATE TYPE "PetType" AS ENUM ('DOG', 'CAT');

-- AlterTable
ALTER TABLE "pets" DROP COLUMN "pet_type",
ADD COLUMN     "pet_type" "PetType" NOT NULL,
DROP COLUMN "sex",
ADD COLUMN     "sex" "Sex",
DROP COLUMN "size",
ADD COLUMN     "size" "Size";
