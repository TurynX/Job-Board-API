/*
  Warnings:

  - Changed the type of `salary` on the `Jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "salary",
ADD COLUMN     "salary" INTEGER NOT NULL;
