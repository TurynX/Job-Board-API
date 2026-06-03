/*
  Warnings:

  - The `status` column on the `Applications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Jobs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'REVIEWING', 'INTERVIEWING', 'OFFERED', 'REJECTED');

-- AlterTable
ALTER TABLE "Applications" DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED';

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "status",
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'OPEN';
