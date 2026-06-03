/*
  Warnings:

  - You are about to drop the column `jobType` on the `Jobs` table. All the data in the column will be lost.
  - Added the required column `category` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `Jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salary` to the `Jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "jobType",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "salary" TEXT NOT NULL;
