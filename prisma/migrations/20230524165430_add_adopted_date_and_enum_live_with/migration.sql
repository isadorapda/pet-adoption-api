/*
  Warnings:

  - The `may_live_with` column on the `pets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `age` on table `pets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sex` on table `pets` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `pets` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MayLiveWith" AS ENUM ('CATS', 'DOGS', 'CHILDREN', 'ELDER', 'ANY');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "adopted_at" TIMESTAMP(3),
ALTER COLUMN "age" SET NOT NULL,
DROP COLUMN "may_live_with",
ADD COLUMN     "may_live_with" "MayLiveWith" NOT NULL DEFAULT 'ANY',
ALTER COLUMN "sex" SET NOT NULL,
ALTER COLUMN "size" SET NOT NULL;
